import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets.js";
import Message from "./Message.js";

const Messages = () => {
  const [taskArr, setTaskArr] = useState([]);

  useEffect(() => {
    socket.on("server_message", (data) => {
      console.log("server message event received on frontend", data);
      setTaskArr((taskArr) => [...taskArr, data]);
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
