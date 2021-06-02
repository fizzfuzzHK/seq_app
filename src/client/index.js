import React from "react";
import ReactDOM from "react-dom";
import Seq from "./Seq.js"
import Counter from "./Counter.js"
import Parent from './Parent'

const Index = () => {
  return (
    <div>
    <div className="app">
      <div><Seq /></div>
      </div>
      <style jsx>{`
      
       `}</style>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("index")); 