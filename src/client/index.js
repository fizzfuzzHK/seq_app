import React from "react";
import ReactDOM from "react-dom";
import Seq from "./Seq.js"
import Counter from "./Counter.js"
const Index = () => {
  return  (
    <div>
        <div>Hello React!</div>
        <div><Seq /></div>
        <div><Counter /></div>
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("index")); 