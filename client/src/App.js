import React from "react";
import io from "socket.io-client";
// import axios from "axios";
import Form from "./components/Form/Form.js";

function App() {
  // SOCKET STUFF
  // Opens the connection between client and server
  const socket = io("http://localhost:5000", {
    upgrade: false,
    transports: ["websocket"],
  });

  // Socket on receving event
  socket.on("welcome", (message) => {
    console.log("THIS IS WELCOME EVENT", message);
  });

  return (
    <div className="App">
      <p>I am a message on the front end :D </p>
      <Form />
    </div>
  );
}

export default App;
