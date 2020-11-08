import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message.js";

const Messages = () => {
  const [receivedMessageArr, setReceivedMessageArr] = useState([]);

  useEffect(() => {
    const socket = io();
    // EVENT RECEIVER: Receiving message event from server
    socket.on("server_message", (data) => {
      console.log(data);
      //   const add = receivedMessageArr.concat(data);
      setReceivedMessageArr((receivedMessageArr) => [
        ...receivedMessageArr,
        data,
      ]);
    });
  }, []);

  console.log("STATE IN MESSAGES", receivedMessageArr);

  return (
    <div>
      <Message receivedMessageArr={receivedMessageArr} />
    </div>
  );
};

export default Messages;
