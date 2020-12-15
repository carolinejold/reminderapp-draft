import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { socket } from "../sockets/sockets";
import "./Form.css";

const Form = () => {
  const [inputValue, setInputValue] = useState<string | null>("");
  const [task, setTask] = useState<string | null>("");

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInputValue(e.target.value);
    setTask(e.target.value);
  };

  const preventSubmit = (e: React.SyntheticEvent) => {
    return !task || / {2,}/gm.test(task) ? e.preventDefault() : null;
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    socket.emit("client_message", task);
    setInputValue("");
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
        <Button className="form-button" onClick={preventSubmit} type="submit">
          Add
        </Button>
      </form>
      <div>
        <p
          style={{
            visibility:
              task !== null && / {2,}/gm.test(task) ? "visible" : "hidden",
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
