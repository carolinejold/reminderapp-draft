import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import "./Join.css";

const Join: React.FC = () => {
  const [name, setName] = useState<string | null>("");
  const [room, setRoom] = useState<string | null>("");
  const [errMessage, setErrMessage] = useState<string | null>("");

  const enterDetails = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrMessage("Please enter a name and a list to continue");
  };

  const onChangeRoom: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setRoom(e.target.value);
  };

  const onChangeName: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setName(e.target.value);
  };

  return (
    <div>
      <div className="join-container">
        <h1>Family Reminders App</h1>
        <Divider variant="middle" />
        <br></br>
        <h3>
          Welcome, please enter your name & choose which list you'd like to
          view.
        </h3>
        <br></br>
        <div>
          <TextField
            label="Enter your name"
            placeholder="Name"
            className="join-input"
            type="text"
            onChange={onChangeName}
          />
        </div>
        <div>
          <TextField
            label="Select your list"
            placeholder="List"
            className="join-input"
            type="text"
            onChange={onChangeRoom}
          />
        </div>
        <small>
          <br></br>
        </small>

        <Link
          onClick={(e: any) => (!name || !room ? enterDetails(e) : null)}
          to={`/list?room=${room}&name=${name}`}
        >
          <Button variant="outlined" color="default" type="submit">
            Submit
          </Button>
        </Link>
        <br></br>
        <br></br>
        <small
          style={{
            visibility: !name || !room ? "visible" : "hidden",
            color: "red",
          }}
        >
          {errMessage}
        </small>
      </div>
    </div>
  );
};

export default Join;

// const { name, room } = queryString.parse(location.search);