import React from 'react';
import {useState,useEffect, useRef} from 'react'
import Child from './Child.js'




let audioContext;
audioContext = new AudioContext();

const Parent = () => {
useEffect(() => {
  
    let lock = false
    if (!lock) {
        // play silent buffer to unlock the audio
        var buffer = audioContext.createBuffer(1, 1, 22050);
        var node = audioContext.createBufferSource();
        node.buffer = buffer;
        node.start(0);        
        lock =true;
    }

}, []);
    
   return (
    <div>
        <div className="app">
                <Child audioContext={audioContext} />
        </div>

       
   </div>
   )


   
};


export default Parent;