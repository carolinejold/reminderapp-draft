import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../sockets/sockets.js";
import "./Form.css";

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
            className="form-task-input"
          />
        </label>
        <Button
          className="form-button"
          onClick={(event) =>
            !task || / {2,}/gm.test(task) ? event.preventDefault() : null
          }
          type="submit"
        >
          Add
        </Button>
      </form>
      <div>
        {/* <p
          style={{
            visibility:
              task === " " || / {2,}/gm.test(task) ? "visible" : "hidden",
            textAlign: "center",
            fontSize: "0.8em",
            color: "red",
          }}
        >
          Please enter a task
        </p> */}
        <p
          style={{
            visibility: / {2,}/gm.test(task) ? "visible" : "hidden",
            textAlign: "center",
            fontSize: "0.8em",
            color: "red",
          }}
        >
          Please remove multiple space characters / enter a task
        </p>
      </div>
    </div>
  );
};

export default Form;
