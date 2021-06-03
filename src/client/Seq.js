import React from 'react';
import {useState,useEffect, useRef} from 'react'
import Track from './Track.js'
import Snare from './Snare.js'
import Hihat from './Hihat.js'
import kickFile from '../sounds/kick.wav'
import snareFile from '../sounds/snare.wav'
import hihatFile from '../sounds/hihat.wav'

var audioContext;
audioContext = new AudioContext();

var timerWorker; 
timerWorker = new Worker('./worker.js');

const Seq = () => {
    // var audioContext;
    var bufferLoader;
    var current32thNote = useRef(null);        // What note is currently last scheduled?
    var lookahead = 25.0;       // How frequently to call scheduling function 
    var nextNoteTime = useRef(0.0);     // when the next note is due.
    var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
    var last16thNoteDrawn = -1; // the last "box" we drew on the screen
    var notesInQueue = [];      // the notes that have been put into the web audio,
    var lock = false;
    var bufferSound;
    var tempo = 120.0;          // tempo (in beats per minute)
    let secondsPerBeat = 60.0 / tempo;

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
        nextNoteTime.current +=  0.25*secondsPerBeat;    // Add beat length to last beat time      
        current32thNote.current++;    // Advance the beat number, wrap to zero
        if (current32thNote.current == 32) {
            current32thNote.current = 0;
        }
    }

    function scheduleNote( beatNumber, time ) {
        // push the note on the queue, even if we're not playing.
        notesInQueue.push( { note: beatNumber, time: time } );     
        // create an oscillator
        // playSound(props.buffer, time)
        tracks.forEach((tracks,i) => {
            console.log(tracks["notes"]);

            if(tracks["notes"][current32thNote.current]){
                
                var source = audioContext.createBufferSource();
                source.buffer = bufferSound[i];
                source.connect(audioContext.destination);
                source.start(time);
            }
        })     
    }

    function scheduler() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        while (nextNoteTime.current < audioContext.currentTime + scheduleAheadTime ) {  
            console.log('nextNoteTime.current is '  + nextNoteTime.current);
               
                scheduleNote(current32thNote.current, nextNoteTime.current);
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
            current32thNote.current = 0;
            console.log('audio context time ' + audioContext.currentTime);
            
            nextNoteTime.current = audioContext.currentTime + 0.03;
            timerWorker.postMessage("start");    
    }

    function stop() {
        console.log('stop');
        setIsPlaying(false);

        timerWorker.postMessage("stop");    
    }
    function finishedLoading(bufferList) {
        bufferSound = bufferList
        console.log('finished');      
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
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
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
  
    useEffect(() => {
        bufferLoader = new BufferLoader(
            audioContext,
            [
            kickFile,
            snareFile,
            hihatFile,
            ],
            finishedLoading
            );
        
        bufferLoader.load();
        
        timerWorker.onmessage = function(f) {
            
            if (f.data == "tick") {
                scheduler();
            }
            else
                console.log("message: " + f.data);
        };
        timerWorker.postMessage({"interval":lookahead});
        console.log('test');
    }, []);

    const handleClick =  (id,number) => {
        let notes_copy = []
        notes_copy = tracks.slice()
        notes_copy[id]["notes"][number] = !notes_copy[id]["notes"][number]
        setTracks(notes_copy)
    }

    const handleChangeTemplate = (template) => {
        console.log(techno);
        
        setTracks(techno)
    }

   return (
    <div>
        <div className="app">
            <div className="title">S<span>e</span>quencer</div>
            <div className="sequencer">
                {tracks.map(tracks=> (<Track key={tracks.id} id={tracks.id} name={tracks.name} notes={tracks.notes} currentNote={current32thNote.current} handleClick={handleClick} />))}
            {/* <div className="play" onClick={() => handleChangeTemplate("techno")}>Techno</div> */}
            {!isPlaying ? <div className="play" onClick={handlePlay}>Play</div> : <div className="play" onClick={handleStop}>Stop</div>}
            
            </div>
        </div>

        <style jsx>{`
            .app {
                background-color:rgb(37, 37, 37);
                min-height: 100vh;
                width:vw;
                display: flex;
                flex-flow: column;
            }
            .title {
                font-size: 60px;
                color: white;
                text-align: center;
                letter-spacing:15px;
                {/* background-color: aqua; */}
                width:vw;
                height:30px;
                left: 0;
                right: 0;
                margin-top:100px;
                margin-bottom:180px
            }
            .title span {
                color:rgba(255, 0, 0, 0.836);
            }
            .seq {
                display: flex;
                justify-content: center; /* 子要素をflexboxにより中央に配置する */
                width:vw;

            }
           
            .play {
                font-size: 40px;
                color: white;
                text-align: center;
                letter-spacing:15px;
                {/* background-color: aqua; */}
                width:vw;
                height:30px;
                left: 0;
                right: 0;
                margin-top:100px;
                margin-bottom:150px
            }
        `}</style>
   </div>
   )
};

export default Seq;