import React from 'react';
import {useState,useEffect} from 'react'
import Track from './Track.js'
import kickFile from '../sounds/kick.wav'
import snareFile from '../sounds/snare.wav'
import hihatFile from '../sounds/hihat.wav'

const audioContext = new AudioContext();
console.log("a" + audioContext.currentTime);

const timerWorker= new Worker('./worker.js');
const lookahead = 25.0;       // How frequently to call scheduling function 



const Seq = () => {
    // var audioContext;
    let current32thNote;        // What note is currently last scheduled?
    let nextNoteTime = 0.0;     // when the next note is due.
    const scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
    let last16thNoteDrawn = -1; // the last "box" we drew on the screen
    let notesInQueue = [];      // the notes that have been put into the web audio,
    
    var bufferSound;
    let tempo = 120.0;          // tempo (in beats per minute)
    let secondsPerBeat = 60.0 / tempo;
    let isClicked = false;

    
    const [tracks, setTracks] = useState(
        [
            {
                id:0,
                name :"kick", 
                notes: [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            },
            {
                id:1,
                name: "snare",
                notes:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            },
            {   
                id:2,
                name: "hihat",
                notes:[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
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

    const [isPlaying, setisPlaying] = useState(false);
    const [lock, setLock] = useState(true);

    function handlePlay (e){
        e.preventDefault();
        play()
    }
    function handleStop (e){
        console.log('stop');
        
        e.preventDefault();
        stop()
    }

    function nextNote() {
        // Advance current note and time by a 16th note...
                                          // tempo value to calculate beat length.
        nextNoteTime +=  0.25*secondsPerBeat;    // Add beat length to last beat time      
        console.log();
        
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
            
            if(tracks["notes"][beatNumber]){

                let source = audioContext.createBufferSource();
                source.buffer = bufferSound.current[i];
                source.connect(audioContext.destination);
                source.start(time);
                console.log('time is ' + time);
                
            }
        })     
    }
    // console.log("next" +nextNoteTime);
    
    function scheduler() {
        // while there are notes that will need to play before the next interval, 
        // schedule them and advance the pointer.
        console.log("current note is " + current32thNote.current);
        console.log(audioContext.currentTime);
        
        while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) { 
            
                scheduleNote(current32thNote.current, nextNoteTime);
                nextNote();             
        }
    }

    function play() {
        if (lock) {
        // play silent buffer to unlock the audio
        console.log("a" + audioContext.currentTime);

            const buffer = audioContext.createBuffer(1, 1, 22050);
            const node = audioContext.createBufferSource();
            node.buffer = buffer;
            node.start(0);
            console.log('started');
            setLock(false);
        }
                        
            nextNoteTime = audioContext.currentTime;
            console.log('nextNotetime' + nextNoteTime);
            
            setisPlaying(true);
            current32thNote.current = 0;

            timerWorker.postMessage("start");    
    }

    function stop() {
        timerWorker.postMessage("stop");    
        setisPlaying(false);
        current32thNote.current = 0

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
    for (let i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
    console.log('loaded buffer');
    
  }
  
    // useEffect(() => {
    //     console.log("a" + audioContext.currentTime);

    //     const bufferLoader = new BufferLoader(
    //         audioContext,
    //         [
    //         kickFile,
    //         hihatFile,
    //         snareFile,
    //         ],
    //         finishedLoading
    //         );
        
    //     console.log("a" + audioContext.currentTime);

    //     bufferLoader.load();
    //     console.log("a" + audioContext.currentTime);

    // timerWorker.onmessage = function(f) {
            
    //     if (f.data == "tick") {
    //         scheduler();
    //     }
    //     else
    //         console.log("message: " + f.data);
    // };
    // timerWorker.postMessage({"interval":lookahead});
    
    
    //     console.log('test');
    // }, []);

    const handleClick =  (id,number) => {
        let notes_copy = []
        notes_copy = tracks.slice()
        notes_copy[id]["notes"][number] = !notes_copy[id]["notes"][number]
        setTracks(notes_copy)
        console.log(notes_copy);
        
    }

    const handleChangeTemplate = (template) => {
        console.log(techno);
        
        setTracks(techno)
    }

    const handleInit = () => {
        if(!isClicked){
            audioContext.resume().then(console.log("clicked"))
            isClicked = true;
        }
    }

   return (
    <div>
        <div className="app" onClick={handleInit}>
            <div className="title">S<span>e</span>quencer</div>
            <div className="sequencer">
                {tracks.map(tracks=> (<Track key={tracks.id} id={tracks.id} name={tracks.name} notes={tracks.notes} handleClick={handleClick} />))}
            {/* <div className="play" onClick={() => handleChangeTemplate("techno")}>Techno</div> */}
            {!isPlaying ?  <div className="play" onClick={handlePlay}>Play</div>: <div className="play" onClick={handleStop}>Stop</div>}
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
                margin-bottom:150px
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