// NOTES ON SENDING FORM DATA TO EXPRESS BACKEND

// https://stackoverflow.com/questions/61986655/react-hooks-how-to-make-a-post-request-to-server

import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../sockets/sockets.js";

const Form = ({ name, room }) => {
  const [inputValue, setInputValue] = useState(""); // TODO: try to change these into array of objects rather than separate states. [{title: 'something', desc: 'something'}]
  const [task, setTask] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("FORM.js - task before submitted:", task);
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
          <TextField
            id="standard-basic"
            label="Add your task"
            type="text"
            name="task"
            value={inputValue}
            onChange={onChange}
          />
        </label><br></br>
        <Button type="submit">Add</Button>
      </form>
    </div>
  );
};

export default Form;
