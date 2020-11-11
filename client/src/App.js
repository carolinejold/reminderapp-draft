import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Tasks from "./components/Tasks/Tasks.js";
import Join from "./components/Join/Join.js";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Join} />
        <Route path="/chat" exact component={Tasks} />
      </Router>
    </div>
  );
};

export default App;
