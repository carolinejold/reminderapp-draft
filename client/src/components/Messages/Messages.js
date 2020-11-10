import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets.js";
import Message from "./Message.js";

const Messages = () => {
  const [messageArr, setMessageArr] = useState([]);

  // useEffect(() => {
  //   // EVENT RECEIVER: Receiving message event from server
  //   // socket.on("server_message", (data) => {
  //   //   console.log("server message event received on frontend", data);
  //   //   //   const add = receivedMessageArr.concat(data);
  //   //   setMessageArr((messageArr) => [...messageArr, data]);
  //   // });
  // }, []);

  // console.log("STATE IN MESSAGES", messageArr);

  return (
    <div>
      <Message messageArr={messageArr} />
    </div>
  );
};

export default Messages;
