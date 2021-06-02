import React from 'react';
import {useState,useEffect, useRef, useImperativeHandle} from 'react'

const Child = (props)  => {



    const noteLength = 3;

    var osc = props.audioContext.createOscillator();
    osc.connect( props.audioContext.destination );
    
    osc.start();

   return (
       <div>child</div>
   )
};


export default Child;