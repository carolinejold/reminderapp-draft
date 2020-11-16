import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets.js";
import Pending from "./Pending.js";
import Complete from "./Complete.js";
import "./Tasks.css";

const Tasks = () => {
  const [pendingArr, setPendingArr] = useState([]);
  const [completedArr, setCompletedArr] = useState([]);

  useEffect(() => {
    socket.on("showDbTasksPending", (dbTasksPending) => {
      setPendingArr(dbTasksPending);
    });

    socket.on("server_message", (taskObj) => {
      // console.log("server message event received on frontend", taskObj);
      setPendingArr((pendingArr) => [...pendingArr, taskObj]);
    });

    socket.on("update_pending", (data) => {
      setTaskArr(data);
    });

    // socket.on("update_completed", (data) => {
    //   setCompletedArr((completedArr) => [...completedArr, data]);
    // });
  }, []);

  return (
    <div className="tasks-container">
      <Pending pendingArr={pendingArr} />
      <p className="tasks-divider">-- Completed Tasks --</p>
      <Complete completedArr={completedArr} />
    </div>
  );
};

export default Tasks;
