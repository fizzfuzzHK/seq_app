import React from 'react';
import {useState,useEffect, useRef} from 'react'
import Track from './Track.js'
import kickFile from '../sounds/kick.wav'
import snareFile from '../sounds/snare.wav'
import hihatFile from '../sounds/hihat.wav'
import './Seq.scss'
import ContinuousSlider from './Slider.js'

let audioContext;
audioContext = new AudioContext();

let bufferSound;
const gainNode = audioContext.createGain()

function finishedLoading(bufferList) {
    bufferSound = bufferList
    console.log('finished buffer load');      
}

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
// Load buffer asynchronously
const request = new XMLHttpRequest();
request.open("GET", url, true);
request.responseType = "arraybuffer";

const loader = this;

request.onload = function() {
  // Asynchronously decode the audio file data in request.response
  loader.context.decodeAudioData(
    request.response,
    function(buffer) {
      if (!buffer) {
        alert('error decoding file data: ' + url);
        return;
      }
      loader.bufferList[index] = buffer;
      if (++loader.loadCount == loader.urlList.length)
        loader.onload(loader.bufferList);
    },
    function(error) {
      console.error('decodeAudioData error', error);
    }
  );
}

request.onerror = function() {
  alert('BufferLoader: XHR error');
}

request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
    console.log('loaded buffer');
    
}

const bufferLoader = new BufferLoader(
    audioContext,
    [
    kickFile,
    snareFile,
    hihatFile,
    ],
    finishedLoading
    );

bufferLoader.load();

const Seq = () => {
    // var audioContext;
    // var bufferLoader;
    // var current32thNote = useRef(null);        // What note is currently last scheduled?
    const lookahead = 25.0;       // How frequently to call scheduling function 
    const nextNoteTime = useRef(0.0);     // when the next note is due.
    const scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
    const last16thNoteDrawn = -1; // the last "box" we drew on the screen
    const notesInQueue = [];      // the notes that have been put into the web audio,
    let lock = false;
    // var tempo = 120.0;          // tempo (in beats per minute)
    
  
    const [tracks, setTracks] = useState(
        [
            {
                id:0,
                name :"kick", 
                notes:[true, 0, true, 0, 0, 0, true, false, true, 0, true, 0, 0, true, 0, true, true, 0, true, 0, 0, 0, true, 0, true, 0, true, 0, 0, true, true, true]
            },
            {
                id:1,
                name: "snare",
                notes:[0, 0, 0, 0, true, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0, 0, 0, 0, 0, true, 0, 0, 0]
            },
            {   
                id:2,
                name: "hihat",
                notes:[1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1]
            },
        ]
    );

    const techno =   [
        {
            id:0,
            name :"kick", 
            notes: [true,false,false,false,true,false,false,false,true,false,false,false,true,false,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true]
        },
        {
            id:1,
            name: "snare",
            notes:[true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true]
        },
        {   
            id:2,
            name: "hihat",
            notes:[true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true,true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true]
        },
    ]

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentNote, setCurrentNote] = useState(0);
    const [tempo, setTempo] = useState(120);
    const [gain, setGain] = useState(30);

    console.log("gain " + gain);
    console.log("tempo " + tempo);

    gainNode.gain.value = gain / 100 // 10 %
    gainNode.connect(audioContext.destination)
    
    console.log('test');
    
    let secondsPerBeat = 60.0 /tempo;

    const [test, settest] = useState();

    function handlePlay (e){
        e.preventDefault();
        play()
    }

    function handleStop (e){
        e.preventDefault();
        stop()
    }

    function nextNote() {
        // Advance current note and time by a 16th note...
                                          // tempo value to calculate beat length.
                                          console.log("tempo is " + secondsPerBeat.current);

        nextNoteTime.current +=  0.25*secondsPerBeat;    // Add beat length to last beat time  
        console.log(currentNote + 1);
        var test = currentNote + 1
        setCurrentNote(test)  
        console.log(currentNote);
          // Advance the beat number, wrap to zero
        if (currentNote == 31) {
            setCurrentNote(0)
        }
    }

    function scheduleNote( beatNumber, time ) {
        // push the note on the queue, even if we're not playing.
        notesInQueue.push( { note: beatNumber, time: time } );     
        // create an oscillator
        // playSound(props.buffer, time)
        tracks.forEach((tracks,i) => {
            if(tracks["notes"][beatNumber]){            
                var source = audioContext.createBufferSource();
                source.buffer = bufferSound[i];
                source.connect(gainNode);
                source.start(time);
            }
        })     
    }

    function scheduler() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (nextNoteTime.current < audioContext.currentTime + scheduleAheadTime ) {  
            scheduleNote(currentNote, nextNoteTime.current);
            nextNote();             
        }
    }

    function play() {
        if (!lock) {
        // play silent buffer to unlock the audio
            var buffer = audioContext.createBuffer(1, 1, 22050);
            var node = audioContext.createBufferSource();
            node.buffer = buffer;
            node.start(0);
            console.log('started');
            lock = true;
        }
        setIsPlaying(true);
        setCurrentNote(0)     
        nextNoteTime.current = audioContext.currentTime + 0.03;
        timerWorker.current.postMessage("start");    
    }

    function stop() {
        console.log('stop');
        setIsPlaying(false);
        timerWorker.current.postMessage("stop");    
    }

    const handlerChangeBPM = (e) => {
        setTempo(e.target.value);
    }

    const handlerChangeGain = (newValue) => {
        setGain(newValue);        
    }

    const handleClick =  (id,number) => {
        let notes_copy = []
        notes_copy = tracks.slice()
        notes_copy[id]["notes"][number] = !notes_copy[id]["notes"][number]
        setTracks(notes_copy)
    }

    const handleChangeTemplate = (template) => {        
        setTracks(techno)
    }
     
    const timerWorker = useRef(new Worker('./worker.js'));

    useEffect(() => {
     
      timerWorker.current.onmessage = function(f) {  
        if (f.data == "tick") {
            scheduler();
            
        }
        else
            console.log("message: " + f.data);
    };
    timerWorker.current.postMessage({"interval":lookahead});
   
      
    }, [currentNote]);
      
  

    return (
        <div>
            <div className="app">
                <div className="title">S<span>e</span>quencer</div>
                <div className="sequencer">
                    {tracks.map(tracks=> (<Track key={tracks.id} id={tracks.id} name={tracks.name} notes={tracks.notes} currentNote={currentNote} handleClick={handleClick} />))}
                {/* <div className="play" onClick={() => handleChangeTemplate("techno")}>Techno</div> */}
                <div class="range-slider">
                            {/* <span id="rs-bullet" className="rs-label">0</span> */}
                            {/* <input id="rs-range-line" value={gain*100} onChange={handlerChangeGain} className="rs-range" type="range"  min="0" max="100"/> */}
                </div>
                <div className="volumeSlider">
                    <ContinuousSlider value={gain} onChange={handlerChangeGain}/>
                </div>
                {!isPlaying ? <div className="play" onClick={handlePlay}>Play</div> : <div className="play" onClick={handleStop}>Stop</div>}
                
                {/* <div className="container"> 
                    <div class="range-slider">
                        <input id="rs-range-line" value={tempo} onChange={handlerChangeBPM} className="rs-range" type="range"  min="0" max="180"/>
                    </div>
                    <div className="box-minmax">
                        <span>0</span><span>180</span>
                    </div>
                </div> */}
            </div>
        </div>
   </div>
   )
};

export default Seq;


