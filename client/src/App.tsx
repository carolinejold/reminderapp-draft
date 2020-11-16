import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import List from "./components/List/List.js";
import Join from "./components/Join/Join.js";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={Join} />
        <Route path="/list" exact component={List} />
      </Router>
    </div>
  );
};

export default App;
