import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import "./Join.css";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div>
      <h1>Family Reminders App</h1>
      <Divider variant="middle" />
      <br></br>
      <h3>
        Welcome, please enter your name & choose which list you'd like to view.
      </h3>
      <br></br>
      <div>
        <TextField
          id="standard-basic"
          label="Enter your name"
          placeholder="Name"
          className="join-input"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <TextField
          id="standard-basic"
          label="Select your list"
          placeholder="List"
          className="join-input"
          type="text"
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
      <Link
        onClick={(event) => (!name || !room ? event.preventDefault() : null)}
        to={`/list?room=${room}&name=${name}`}
      >
        <Button color="default" type="submit">
          Submit
        </Button>
      </Link>
    </div>
  );
};

export default Join;

// const { name, room } = queryString.parse(location.search);
