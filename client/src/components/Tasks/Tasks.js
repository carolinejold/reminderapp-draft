import React, { useEffect, useState } from "react";
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

    // socket.on("toggled_task", (data) => {
    //   // console.log("toggled task data", data);
    //   setTaskArr(data);
    // });
  }, []);

  return (
    <div className="tasks-container">
      <Task
        taskArr={taskArr}
        setTaskArr={setTaskArr}
        completedArr={completedArr}
        setCompletedArr={setCompletedArr}
      />
      <Complete />
    </div>
  );
};

export default Tasks;
