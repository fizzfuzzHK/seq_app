import React from 'react';
import './Track.scss'

const Track = (props)  => {
    var test = "test3"
    console.log("currentz" + props.currentNote -1);
  

   return (
        <div>
            <div className="seq">
                {new Array(32).fill().map((v, i) => (
                    <div className={
                        props.currentNote > 0 
                        ? (
                            props.currentNote-1 === i
                                ? (props.notes[i] ? "box_fill" : i % 4 === 0 ? "box_quarter_note" : "box_unfill")+ " test" 
                                : (props.notes[i] ? "box_fill" : i % 4 === 0 ? "box_quarter_note" : "box_unfill")
                            )
                        : (
                            i === 31 
                                ? (props.notes[i] ? "box_fill" : i % 4 === 0 ? "box_quarter_note" : "box_unfill")+ " test" 
                                : (props.notes[i] ? "box_fill" : i % 4 === 0 ? "box_quarter_note" : "box_unfill")
                            )                  
                    } 
                        key={i} 
                        onClick={() => props.handleClick(props.id, i)}>
                            {/* <div id="id" className="test">a</div> */}
                    </div>))}
            </div>

   </div>
   )
};

export default Track;