import React, { useState, useEffect } from "react";
import queryString from "query-string";
import Form from "../Form/Form.js";
import Messages from "../Messages/Messages.js";
import { socket } from "../sockets/sockets.js";

const Chat = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [userJoinedMessage, setUserJoinedMessage] = useState([]);
  // const [userList, setUserList] = useState([]);
  // const [disconnectMessage, setDisconnectMessage] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const { name, room } = queryString.parse(window.location.search);
    setRoom(room);
    setName(name);

    // 1) Emit new user event on connection from server
    socket.emit("new_user", { name, room });

    // 2) Receive welcome_user event from server
    socket.on("welcome_user", (data) => {
      setWelcomeMessage(data);
    });

    // 2.5) Receive user_joined event from server
    socket.on("user_joined", (data) => {
      setUserJoinedMessage((userJoinedMessage) => [...userJoinedMessage, data]);
    });

    // socket.on("user_left", (data) => {
    //   console.log("disconnect data", data);
    //   setDisconnectMessage(data);
  }, []);

  return (
    <div>
      <h1>Family Reminders App</h1>
      <p>{welcomeMessage}</p>
      <div>
        {userJoinedMessage.map((el) => (
          <p key={el}>{el}</p>
        ))}
      </div>

      {/* <p>{disconnectMessage}</p> */}
      <Form name={name} room={room} />
      <Messages name={name} />
    </div>
  );
};

export default Chat;
