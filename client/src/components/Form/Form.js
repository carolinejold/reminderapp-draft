// NOTES ON SENDING FORM DATA TO EXPRESS BACKEND

// https://stackoverflow.com/questions/61986655/react-hooks-how-to-make-a-post-request-to-server

import React, { useState } from "react";
import axios from "axios";

const Form = () => {
  const [task, setTask] = useState(""); // TODO: try to change these into array of objects rather than separate states. [{title: 'something', desc: 'something'}]

  const sendTask = async (task) => {
    axios({
      method: "post",
      url: `http://localhost:5000/`,
      data: task,
      headers: {
        "content-type": "application/json",
      },
    }).then((res) => {
      console.log("inside sendtask", task);
      console.log("SENDTASK RES", res);
      console.log("SENDTASK RESDATA", res.data).catch((err) => {
        console.log(err);
      });
    });
  };

  // try {
  //   let res = await axios.post(`http://localhost:5000/`, task);
  //   console.log("inside sendtask", task);
  //   console.log("SENDTASK RES", res);
  //   console.log("SENDTASK RESDATA", res.data);
  // } catch (err) {
  //   console.log(err);
  // }
  //   };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(task);
    if (!task) return; // TODO error handling
    sendTask(task); // Send task to express backend when form is submitted
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
