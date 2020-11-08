import React, { useState, useEffect } from "react";
import io from "socket.io-client";
// import axios from "axios";
import Form from "./components/Form/Form.js";
import Messages from "./components/Messages/Messages.js";
import "./App.css";

// THIS WAS ADDED BC SOCKET WASN'T CONNECTING TO SERVER PROPERLY, mht not need it

const App = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [disconnectMessage, setDisconnectMessage] = useState("");

  // SOCKET STUFF
  // Opens the connection between client and server
  const socket = io("http://localhost:5000", {
    upgrade: false,
    transports: ["websocket"],
  });

  useEffect(() => {
    // const socket = io();

    // EVENT RECEIVER: Receiving message event from server
    socket.on("welcome", (data) => {
      setWelcomeMessage(data);
    });

    socket.on("user_left", (data) => {
      console.log("disconnect data", data);
      setDisconnectMessage(data);
    });
  }, []);

  console.log(welcomeMessage)


  console.log('disconnect message', disconnectMessage)

  return (
    <div className="App">
      <h1>Family Reminders App</h1>
      <p>{welcomeMessage}</p>
      <p>{disconnectMessage}</p>
      <Form />
      <Messages />
    </div>
  );
};

export default App;
