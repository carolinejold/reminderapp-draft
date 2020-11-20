import React, { useState, useEffect, ReactElement } from "react";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import qs from "query-string";
import Form from "../Form/Form";
import Tasks from "../Tasks/Tasks";
import { socket } from "../sockets/sockets";
import { qsTypes } from "../../types/types";
import "./List.css";
const { v4: uuidv4 } = require("uuid");

const List: React.FC = (): ReactElement => {
  const [welcomeMessage, setWelcomeMessage] = useState<string | null | any>("");
  const [userJoinedMessages, setUserJoinedMessages] = useState<Array<string>>(
    []
  );
  const [list, setList] = useState<string | null>("");

  useEffect(() => {
    const { name, list }: qsTypes = qs.parse(window.location.search);
    setList(list);
    console.log(name, list);

    socket.emit("new_user", { name, list });

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
            <small key={uuidv4()}>
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
        <Form />
        <Tasks list={list} />
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
