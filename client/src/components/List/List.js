import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import queryString from "query-string";
import Form from "../Form/Form.js";
import Tasks from "../Tasks/Tasks.js";
import { socket } from "../sockets/sockets.js";

const List = () => {
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

    socket.emit("new_user", { name, room });

    socket.on("welcome_user", (data) => {
      setWelcomeMessage(data);
    });

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
      <Tasks name={name} />
      <Link to={`/`}>
        <p>Go back & choose another list</p>
      </Link>
    </div>
  );
};

export default List;
