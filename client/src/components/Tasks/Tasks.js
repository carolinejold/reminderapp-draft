import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import { socket } from "../sockets/sockets.js";
import Task from "./Task.js";
import Complete from "./Complete.js";
import "./Tasks.css";

const Tasks = () => {
  const [taskArr, setTaskArr] = useState([]);

  useEffect(() => {
    socket.on("showDbTasks", (dbTasks) => {
      console.log("BEFORE ADDING TO STATE", dbTasks);
      setTaskArr(dbTasks);
      console.log("AFTER ADDING TO STATE", taskArr);
    });

    socket.on("server_message", (taskObj) => {
      // console.log("server message event received on frontend", taskObj);
      setTaskArr((taskArr) => [...taskArr, taskObj]);
    });

    // socket.on("toggled_task", (data) => {
    //   // console.log("toggled task data", data);
    //   setTaskArr(data);
    // });
  }, []);

  return (
    <Container className="tasks-container">
      <Task taskArr={taskArr} setTaskArr={setTaskArr} />
      <Complete />
    </Container>
  );
};

export default Tasks;
