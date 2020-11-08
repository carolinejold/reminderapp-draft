import React, { useState, useEffect } from "react";
// import { Redirect } from "react-router";
import io from "socket.io-client";
import queryString from "query-string";
import Form from "../Form/Form.js";
import Messages from "../Messages/Messages.js";
const server = "http://localhost:5000";

const Chat = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [disconnectMessage, setDisconnectMessage] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  //   const [flag, setFlag] = useState(0);

  useEffect(() => {
    const socket = io(`http://localhost:5000`, {
      upgrade: false,
      transports: ["websocket"],
    });

    const { name, room } = queryString.parse(window.location.search);

    setRoom(room);
    setName(name);
    console.log("NAME AND ROOM STATE", name, room);

    socket.emit("join_room", { name, room });

    // WELCOME EVENT RECEIVER: Receiving welcome event from server
    socket.on("welcome", (data) => {
      setWelcomeMessage(data);
    });

    socket.on("user-joined-chat", (data) => {
      console.log("USER JOINED CHAT", data);
    });

    socket.on("user_left", (data) => {
      console.log("disconnect data", data);
      setDisconnectMessage(data);
    });
  }, []);

  return (
    <div>
      <h1>Family Reminders App</h1>
      <p>{welcomeMessage}</p>
      <p>{disconnectMessage}</p>
      <Form name={name} />
      <Messages name={name} />
    </div>
  );
};

export default Chat;
