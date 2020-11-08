import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "./Message.js";

const Messages = () => {
  const [receivedMessage, setReceivedMessage] = useState([]);

  useEffect(() => {
    const socket = io();
    // EVENT RECEIVER: Receiving message event from server
    socket.on("server_message", (data) => {
      setReceivedMessage((receivedMessage) => [...receivedMessage, data]);
    });
  }, []);

  console.log("STATE IN FRONTEND", receivedMessage);

  return (
    <div>
      <Message receivedMessage={receivedMessage} />
    </div>
  );
};

export default Messages;
