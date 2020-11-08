import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message.js";

const Messages = () => {
  const [messageArr, setMessageArr] = useState([]);

  useEffect(() => {
    const socket = io();
    // EVENT RECEIVER: Receiving message event from server
    socket.on("server_message", (data) => {
      console.log(data);
      //   const add = receivedMessageArr.concat(data);
      setMessageArr((messageArr) => [
        ...messageArr,
        data,
      ]);
    });
  }, []);

  console.log("STATE IN MESSAGES", messageArr);

  return (
    <div>
      <Message messageArr={messageArr} />
    </div>
  );
};

export default Messages;
