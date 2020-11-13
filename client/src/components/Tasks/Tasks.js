import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets.js";
import Task from "./Task.js";
import Complete from "./Complete.js";

const Tasks = () => {
  const [taskArr, setTaskArr] = useState([]);

  useEffect(() => {
    socket.on("showDbTasks", (dbTasks) => {
      console.log('BEFORE ADDING TO STATE', dbTasks)
      setTaskArr(dbTasks);
      console.log('AFTER ADDING TO STATE', taskArr);
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
    <div>
      <Task taskArr={taskArr} setTaskArr={setTaskArr} />
      <Complete />
    </div>
  );
};

export default Tasks;
