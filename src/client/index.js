import React from "react";
import ReactDOM from "react-dom";
import Seq from "./Seq.js"

const Index = () => {
  return (
    <div className="app">
      <Seq />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("index")); 