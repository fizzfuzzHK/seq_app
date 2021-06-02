import React from 'react';
import {useState,useEffect, useRef} from 'react'

const Seq = () => {

var audioContext = null;
var unlocked = false;
var isPlaying = true;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 120.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05;      // length of "beep" (in seconds)
var canvas,                 // the canvas element
    canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages
let secondsPerBeat = 60.0 / tempo;

const [notes, setNotes] = useState([true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true]);
const [test, settest] = useState();
const notesRef = useRef(notes);
notesRef.current = notes;


// useEffect(
//     setNotes([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]),
//     [],
//   );

console.log("gloval" + notes)
const handleClick =  (e) => {

   let notes_copy = []
   notes_copy = notes.slice()

    notes_copy[e] = !notes_copy[e];
   setNotes(notes_copy)

   settest("no")
 
}
// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
// window.requestAnimFrame = (function(){
//     return  window.requestAnimationFrame ||
//     window.webkitRequestAnimationFrame ||
//     window.mozRequestAnimationFrame ||
//     window.oRequestAnimationFrame ||
//     window.msRequestAnimationFrame ||
//     function( callback ){
//         window.setTimeout(callback, 1000 / 60);
//     };
// })();

function nextNote() {
    // Advance current note and time by a 16th note...
                                          // tempo value to calculate beat length.
    nextNoteTime +=  secondsPerBeat;    // Add beat length to last beat time
    
    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 16) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );
    console.log('ss');
    
    // create an oscillator
    var osc = audioContext.createOscillator();
    osc.connect( audioContext.destination );
    
    osc.start( time );
    osc.stop( time + noteLength );
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
//    console.log('next' + nextNoteTime + "a" + (audioContext.currentTime + scheduleAheadTime));
   
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        // console.log(nextNoteTime +"L"+ (audioContext.currentTime + scheduleAheadTime ) );
        
        for (let i in notesRef.current){
                        
            if(notesRef.current[i]){
                console.log(i);
                
                scheduleNote( current16thNote, nextNoteTime + i*0.05*secondsPerBeat);
            }
        }
        nextNote();
    }
}

function play() {
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = audioContext.createBuffer(1, 1, 22050);
      var node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");    
}

function resetCanvas (e) {
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0,0); 
}

function draw() {
    
    var currentNote = last16thNoteDrawn;
    var currentTime = audioContext.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn != currentNote) {
        var x = Math.floor( canvas.width / 18 );
        canvasContext.clearRect(0,0,canvas.width, canvas.height); 
        for (var i=0; i<16; i++) {
            canvasContext.fillStyle = ( currentNote == i ) ? 
                ((currentNote%4 === 0)?"red":"blue") : "black";
            canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
        }
        last16thNoteDrawn = currentNote;
    }

    // set up to draw again
    requestAnimFrame(draw);
}

setInterval(() =>console.log(notesRef.current),1000)

useEffect(() => {
    // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
    // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
    // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
    // spec-compliant, and work on Chrome, Safari and Firefox.

    audioContext = new AudioContext();

    // if we wanted to load audio files, etc., this is where we should do it.

    // window.onorientationchange = resetCanvas;
    // window.onresize = resetCanvas;

    // requestAnimFrame(draw);    // start the drawing loop.
    console.log(audioContext.currentTime);

    timerWorker = new Worker('./worker.js');
    
    timerWorker.onmessage = function(f) {
        
        if (f.data == "tick") {
            scheduler();
        }
        else
            console.log("message: " + f.data);
    };
    timerWorker.postMessage({"interval":lookahead});
    console.log('test');
    
    play();
    
}, []);
    



   return (
   <div>
      <div className="sequencer">
         <div className="box" onClick={() => handleClick(0)}></div>
         <div className="box" onClick={() => handleClick(1)}></div>
         <div className="box" onClick={() => handleClick(2)}></div>
         <div className="box" onClick={() => handleClick(3)}></div>
         <div className="box" onClick={() => handleClick(4)}></div>
         <div className="box" onClick={() => handleClick(5)}></div>
         <div className="box" onClick={() => handleClick(6)}></div>
         <div className="box" onClick={() => handleClick(7)}></div>
         <div className="box" onClick={() => handleClick(8)}></div>
         <div className="box" onClick={() => handleClick(9)}></div>
         <div className="box" onClick={() => handleClick(10)}></div>
         <div className="box" onClick={() => handleClick(11)}></div>
         <div className="box" onClick={() => handleClick(12)}></div>
         <div className="box" onClick={() => handleClick(13)}></div>
         <div className="box" onClick={() => handleClick(14)}></div>
         <div className="box" onClick={() => handleClick(15)}></div>
      <div>{test}</div>
      </div>
      
      <style jsx>{`
         .sequencer {
            display: flex;
         }
         .box {
            width: 20px;
            height: 30px;
            margin: 10px;
            background-color: blue;
            color: red;
            }
      `}</style>
   </div>
   )


   
   style
};


export default Seq;