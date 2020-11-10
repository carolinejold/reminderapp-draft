import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Chat from "./components/Chat/Chat.js";
import Join from "./components/Join/Join.js";
import "./App.css";

// const server = "http://localhost:5000/";

// const socket = io(server, {
//   upgrade: false,
//   transports: ["websocket"],
// });

const App = () => {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Join} />
        <Route path="/chat" exact component={Chat} />
      </Router>
    </div>
  );
};

export default App;
