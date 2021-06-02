import React from 'react';
import {useState,useEffect, useRef, useImperativeHandle} from 'react'

const Track = React.forwardRef((props, ref)  => {

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

        
    
    console.dir("kicks props" + props.name)
    // const handleClick =  (e) => {
    //     console.log(e)
    //     let notes_copy = []
    //     notes_copy = kickNotes.slice()
    //     notes_copy[e] = !notes_copy[e];
    //     props.setNotes(notes_copy)
    // }


    

   return (
    <div>
                <div className="seq">
                    {new Array(32).fill().map((v, i) => (<div className={props.notes[i] ? "box_fill" : i % 4 === 0 ? "box_quarter_note" : "box_unfill"} key={i} onClick={() => props.handleClick(props.id, i)}></div>))}
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


export default Track;