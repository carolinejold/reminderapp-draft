import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import queryString from "query-string";
import Form from "../Form/Form.js";
import Tasks from "../Tasks/Tasks.js";
import { socket } from "../sockets/sockets.js";
import "./List.css";

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
    <Container maxWidth="md">
      <div className="list-container">
        <h1>{welcomeMessage}</h1>
        <Divider variant="middle" />
        <br></br>
        <p></p>
        <div>
          {userJoinedMessage.map((el) => (
            <small key={el}>
              {" "}
              <FiberManualRecordIcon
                style={{ fontSize: "0.8em", color: "limegreen" }}
              />{" "}
              {el}
            </small>
          ))}
        </div>
        <br></br>
        {/* <p>{disconnectMessage}</p> */}
        <Form name={name} room={room} />
        <Tasks name={name} />
        <br></br>
        <Link to={`/`}>
          <Button>Go back & choose another list</Button>
        </Link>
      </div>
    </Container>
  );
};

export default List;
