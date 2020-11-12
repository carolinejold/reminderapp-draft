import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets.js";
import Message from "./Message.js";

const Messages = () => {
  const [taskArr, setTaskArr] = useState([]);

  useEffect(() => {
    socket.on("OUTPUT", (dbTasks) => {
      setTaskArr(dbTasks);
    });

    socket.on("server_message", (taskObj) => {
      console.log("server message event received on frontend", taskObj);
      setTaskArr((taskArr) => [...taskArr, taskObj]);
    });

    socket.on("toggled_task", (data) => {
      console.log("toggled task data", data);
      setTaskArr(data);
    });
  }, []);

  return (
    <div>
      <Message taskArr={taskArr} setTaskArr={setTaskArr} />
    </div>
  );
};

export default Messages;
