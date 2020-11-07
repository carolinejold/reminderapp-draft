// NOTES ON SENDING FORM DATA TO EXPRESS BACKEND

// https://stackoverflow.com/questions/61986655/react-hooks-how-to-make-a-post-request-to-server

import React, { useState } from "react";
import io from "socket.io-client";
const socket = io();

const Form = () => {
  const [task, setTask] = useState(""); // TODO: try to change these into array of objects rather than separate states. [{title: 'something', desc: 'something'}]

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO error handling
    console.log("task before submitted:", task);
    // Send task to express backend when form is submitted
    socket.emit("client_message", task);
    // socket.emit("submit-message", (task) => {
    //   // Welcome current user
    //   console.log(task);
    //    // socket.emit('new_message', { id: socket.id, message: messageInput });
    // });
  };

  const onChange = (e) => {
    setTask(e.target.value);
    console.log("task:", task);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          TASK:
          <input
            placeholder="what do you need to do?"
            type="text"
            name="task"
            value={task}
            onChange={onChange}
          />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
};

export default Form;
