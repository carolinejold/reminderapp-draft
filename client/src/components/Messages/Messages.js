import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets.js";
import Message from "./Message.js";

const Messages = () => {
  const [messageArr, setMessageArr] = useState([]);

  useEffect(() => {
    socket.on("server_message", (data) => {
      console.log("server message event received on frontend", data);
      setMessageArr((messageArr) => [...messageArr, data]);
    });
  }, []);

  return (
    <div>
      <Message messageArr={messageArr} />
    </div>
  );
};

export default Messages;
