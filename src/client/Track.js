import React from 'react';

const Track = (props)  => {
  
   return (
        <div>
            <div className="seq">
                <div className="test">{props.currentNote}</div>
                {new Array(32).fill().map((v, i) => (
                    <div className={(props.notes[i] ? "box_fill" : i % 4 === 0 ? "box_quarter_note" : "box_unfill")} 
                        key={i} 
                        onClick={() => props.handleClick(props.id, i)}>
                    </div>))}
            </div>

        <style jsx>{`
            .test{
                font-size:40px
            }
            .seq {
                display: flex;
                justify-content: center;  
                width:vw;
            }
            .box_fill {
                width: 30px;
                height: 30px;
                background-color: rgba(25, 255, 217, 0.74);
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
};

export default Track;