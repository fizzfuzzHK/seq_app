import React from 'react';
import {useState,useEffect, useRef, useImperativeHandle} from 'react'

const Hihat = React.forwardRef((props, ref)  => {

var audioContext = null;
var isPlaying = true;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var current32thNote = 0;        // What note is currently last scheduled?
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

    
const [HihatNotes, setHihatNotes] = useState([true,false,true,false,false,false,false,false,false,false,false,false,false,false,false,true]);
const [test, settest] = useState();
const [lock, setlock] = useState(false);
const notesRef = useRef(HihatNotes);
notesRef.current = HihatNotes;
const scheduleRef = useRef()

// useEffect(
//     setNotes([false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]),
//     [],
//   );

console.log(props)
const handleClick =  (e) => {
    console.log(e)
    let notes_copy = []
   notes_copy = HihatNotes.slice()

    notes_copy[e] = !notes_copy[e];
   setHihatNotes(notes_copy)

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
    nextNoteTime +=  0.25*secondsPerBeat;    // Add beat length to last beat time
    
    current32thNote++;    // Advance the beat number, wrap to zero
    if (current32thNote == 32) {
        current32thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );
    
    // create an oscillator
    var osc = props.audioContext.createOscillator();
    osc.connect( props.audioContext.destination );
    
    osc.start( time );
    osc.stop( time + noteLength );
}
useImperativeHandle(ref, () => ({
    scheduler: () => {
      scheduler()
    }
  
  }))
  
function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
//    console.log('next' + nextNoteTime + "a" + (audioContext.currentTime + scheduleAheadTime));
   
    while (nextNoteTime < props.audioContext.currentTime + scheduleAheadTime ) {
        // console.log(nextNoteTime +"L"+ (audioContext.currentTime + scheduleAheadTime ) );
                            
        if(notesRef.current[current32thNote]){
                
                scheduleNote(current32thNote, nextNoteTime);
                nextNote();

            }
            else{
                nextNote();
            }      
        }
    
}



// useEffect(() => {
//     // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
//     // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
//     // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
//     // spec-compliant, and work on Chrome, Safari and Firefox.

//     audioContext = new AudioContext();

//     // if we wanted to load audio files, etc., this is where we should do it.

//     // window.onorientationchange = resetCanvas;
//     // window.onresize = resetCanvas;

//     // requestAnimFrame(draw);    // start the drawing loop.
//     console.log(audioContext.currentTime);

//     timerWorker = new Worker('./worker.js');
    
//     timerWorker.onmessage = function(f) {
        
//         if (f.data == "tick") {
//             scheduler();
//         }
//         else
//             console.log("message: " + f.data);
//     };
//     timerWorker.postMessage({"interval":lookahead});
//     console.log('test');
    
//     play();
    
// }, []);
    



   return (
    <div　ref={scheduleRef}>
                <div className="seq">
                    {new Array(32).fill().map((v, i) => (<div className={HihatNotes[i] ? "box_fill" : i % 4 === 0 ? "box_quarter_note" : "box_unfill"} key={i} onClick={() => handleClick(i)}></div>))}
                </div>
               

        <style jsx>{`
           
            .seq {
                display: flex;
                justify-content: center; /* 子要素をflexboxにより中央に配置する */
                width:vw;

            }
            .box_fill {
                width: 30px;
                height: 30px;
                background-color: rgb(25, 255, 217);
                border-color: rgb(37, 37, 37);
                border-width: 2px;
                border-style: solid;
                border-radius: 15%;	
            }
            .box_quarter_note {
                width: 30px;
                height: 30px;
                background-color: rgb(124, 124, 124);
                border-color: rgb(37, 37, 37);
                border-width: 2px;
                border-style: solid;
                border-radius: 15%;	
                
            }
            .box_unfill{
                width: 30px;
                height: 30px;
                background-color: rgb(85, 85, 85);
                border-color: rgb(37, 37, 37);
                border-width: 2px;
                border-style: solid;
                border-radius: 15%;	
                
            }
            .box_unfill:hover {
                color:grey;
            }
        `}</style>
   </div>
   )


   
   style
});


export default Hihat;