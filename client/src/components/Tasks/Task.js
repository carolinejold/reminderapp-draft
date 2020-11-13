import React from "react";
import { socket } from "../sockets/sockets.js";
import "./Task.css";

const Task = ({ taskArr, setTaskArr }) => {
  // TODO how can i make this more robust - message_id?
  const toggleTask = (index) => {
    const updatedTasks = [...taskArr];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTaskArr(taskArr);
    socket.emit("toggle_task", taskArr);
  };

  return (
    <div>
      {taskArr.map((el, i) => {
        return (
          <div
            i={i}
            key={el.message_id}
            id={el.message_id}
            className="task-div"
            style={{
              textDecoration: el.completed ? "line-through" : "",
              order: el.completed ? "1" : "0", // NOT WORKING
            }}
            onClick={() => toggleTask(i)}
          >
            <p>{el.task}</p>
            <i>Added by {el.name}</i>
            <p>
              on {el.date} at {el.time}
            </p>
            <div>
              <h3>Mark complete</h3>
              <h3>Delete</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Task;
