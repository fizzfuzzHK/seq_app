import React from 'react';
import {useState,useEffect, useRef} from 'react'


const Test = () => {
    const [currentNumber, setcurrentNumber] = useState(0);


    function countUp() {
        console.log(currentNumber);
        var tmp = currentNumber + 1
        setcurrentNumber(tmp)  
        }
    

    useEffect(() => {
        var timerWorker; 
        timerWorker = new Worker('./worker.js');

        timerWorker.onmessage = function(f) {  
            if (f.data == "tick") {
            countUp();
                }
        }    
    }, []);
      
    return (
        <div className="app">
          {currentNumber}
        </div>
)}
export default Test;


