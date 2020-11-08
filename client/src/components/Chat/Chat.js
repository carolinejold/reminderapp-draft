import React, { useState, useEffect } from "react";
import { Redirect } from "react-router";
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
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);

    // Opens the connection between client and server
    const socket = io(server, {
      upgrade: false,
      transports: ["websocket"],
    });

    setRoom(room);
    setName(name);

    socket.emit("join", { name, room }, (err) => {
      if (err) {
        setFlag(1);
        alert(err);
      }
    });
  }, [server, window.location.search]);

  useEffect(() => {
    const socket = io(server, {
      upgrade: false,
      transports: ["websocket"],
    });
    // WELCOME EVENT RECEIVER: Receiving welcome event from server
    socket.on("welcome", (data) => {
      setWelcomeMessage(data);
    });

    socket.on("user_left", (data) => {
      console.log("disconnect data", data);
      setDisconnectMessage(data);
    });
  }, []);

  if (flag) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h1>Family Reminders App</h1>
      <p>{welcomeMessage}</p>
      <p>Welcome to the {room} list, {name}!</p>
      <p>{disconnectMessage}</p>
      <Form name={name} />
      <Messages name={name} />
    </div>
  );
};

export default Chat;
