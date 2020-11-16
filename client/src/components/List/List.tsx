import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import {queryString} from "query-string";
import Form from "../Form/Form.js";
import Tasks from "../Tasks/Tasks.js";
import { socket } from "../sockets/sockets.js";
import { qsTypes } from "../../types/types";
import "./List.css";

const List: React.FC = () => {
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>("");
  const [userJoinedMessages, setUserJoinedMessages] = useState<Array<
    string
  >>([]);
  const [name, setName] = useState<string | null>("");
  const [room, setRoom] = useState<string | null>("");

  useEffect(() => {
    const { name, room }: qsTypes = queryString.parse(
      window.location.search
    );
    setRoom(room);
    setName(name);

    socket.emit("new_user", { name, room });

    socket.on("welcome_user", (data: string) => {
      setWelcomeMessage(data);
    });

    socket.on("user_joined", (data: string) => {
      setUserJoinedMessages((userJoinedMessages) => [
        ...userJoinedMessages,
        data,
      ]);
    });

    // socket.on("user_left", (data) => {
    //   console.log("disconnect data", data);
    //   setDisconnectMessage(data);
  }, []);

  return (
    // <Container maxWidth="md">
    <div>
      <div className="list-container">
        <h1>{welcomeMessage}</h1>
        <Divider variant="middle" />
        <br></br>
        <p></p>
        <div>
          {userJoinedMessages.map((el) => (
            <small key={el}>
              {" "}
              <FiberManualRecordIcon
                style={{ fontSize: "0.8em", color: "limegreen" }}
              />{" "}
              {el}
              <br></br>
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
      <p className="hint">
        HINT: Scroll down within each task card to see details and options
      </p>
    </div>
    // </Container>
  );
};

export default List;
