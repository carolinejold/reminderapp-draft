import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const Messages = () => {
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    const socket = io();
    socket.on("server_message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  console.log("STATE IN FRONTEND", receivedMessage);

  return <div>{receivedMessage}</div>;
};

export default Messages;
