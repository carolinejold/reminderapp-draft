import React, { useState } from "react";
import { Link } from "react-router-dom";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div>
      <h1>Welcome to the Family Reminders App</h1>
      <h3>Please enter your name</h3>
      <div>
        <input
          placeholder="Name"
          className="joinInput"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <input
          placeholder="Room"
          className="joinInput mt-20"
          type="text"
          onChange={(e) => setRoom(e.target.value)}
        />
      </div>
      <Link
        onClick={(event) => (!name || !room ? event.preventDefault() : null)}
        to={`/chat?name=${name}&room=${room}`}
      >
        <button className={"button mt-20"} type="submit">
          Sign In
        </button>
      </Link>
    </div>
  );
};

export default Join;

// const { name, room } = queryString.parse(location.search);
