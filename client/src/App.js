import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

function App() {
  const [hello, setHello] = useState("");

  useEffect(() => {
    async function fetchData() {
      let response = await axios(`http://localhost:5000/`);
      let result = await response.data.message;
      setHello(result);
      console.log(result);
    }
    fetchData();
  }, []);

  // SOCKET STUFF
  // Opens the connection between client and server
  const socket = io();

  // Socket events
  socket.on("message", (message) => {
    console.log(message);
  });

  return (
    <div className="App">
      {hello}
      <p>I am a message on the front end :D </p>
    </div>
  );
}

export default App;
