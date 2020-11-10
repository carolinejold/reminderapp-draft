// NOTES ON SENDING FORM DATA TO EXPRESS BACKEND

// https://stackoverflow.com/questions/61986655/react-hooks-how-to-make-a-post-request-to-server

import React, { useState } from "react";
import { socket } from "../sockets/sockets.js";

const Form = ({ name, room }) => {
  const [inputValue, setInputValue] = useState(""); // TODO: try to change these into array of objects rather than separate states. [{title: 'something', desc: 'something'}]
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO error handling
    console.log("FORM.js - task before submitted:", task);
    // Send task to express backend when form is submitted
    socket.emit("client_message", task);
    setInputValue("");
  };

  const onChange = (e) => {
    setInputValue(e.target.value);
    setTask(e.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          {name}, add your task:
          <br></br>
          <input
            placeholder="what do you need to do?"
            type="text"
            name="task"
            value={inputValue}
            onChange={onChange}
          />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Form;
