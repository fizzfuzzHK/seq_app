import React from 'react';
import {useState, useEffect} from "react"

var count = 0;
const Test2 = (props) => {
const [test2, settest2] = useState(0);
    
    useEffect(() => {
        console.log('w');
        
        settest2(props.props)
    }, [props.props]);

    return (
        <div >
            {test2}
        </div>
    );
};

export default Test2;