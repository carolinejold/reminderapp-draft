import React, { useEffect, useState } from "react";
import Divider from "@material-ui/core/Divider";

import { socket } from "../sockets/sockets.js";
import Task from "./Task.js";
import Complete from "./Complete.js";
import "./Tasks.css";

const Tasks = () => {
  const [taskArr, setTaskArr] = useState([]);
  const [completedArr, setCompletedArr] = useState([]);

  useEffect(() => {
    socket.on("showDbTasks", (dbTasks) => {
      setTaskArr(dbTasks);
    });

    socket.on("server_message", (taskObj) => {
      console.log("server message event received on frontend", taskObj);
      setTaskArr((taskArr) => [...taskArr, taskObj]);
    });

    socket.on("update_pending", (data) => {
      setTaskArr(data);
    });

    socket.on("update_completed", (data) => {
      setCompletedArr((completedArr) => [...completedArr, data]);
    });
  }, []);

  return (
    <div className="tasks-container">
      <Task taskArr={taskArr} />
      <p className="tasks-divider">-- Completed Tasks --</p>
      <Complete completedArr={completedArr} />
    </div>
  );
};

export default Tasks;
