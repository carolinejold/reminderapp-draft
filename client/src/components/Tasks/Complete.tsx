import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { TaskObjType } from "../../types/types";
import { socket } from "../sockets/sockets";
import "./Complete.css";
const { v4: uuidv4 } = require("uuid");

const Complete: React.FC<{
  completedArr: Array<TaskObjType>;
  list: string | null;
}> = ({ completedArr, list }) => {
  const handleDelete = (id: string) => {
    const updatedCompleted = completedArr.filter((el) => el.message_id !== id);
    socket.emit("delete_task", updatedCompleted, list);
  };

  return (
    <div className="completed-container">
      {completedArr.map((el) => {
        return (
          <div
            key={uuidv4()}
            id={el.message_id}
            className="completed-div"
            style={{
              textDecoration: el.completed ? "line-through" : ","
            }}
            // onClick={() => toggleTask(i)}
          >
            <p>{el.task}</p>
            <br></br>
            <Divider variant="middle" />
            <br></br>
            <small>
              <p>
                Added by {el.name} on {el.date} at {el.time}
              </p>
            </small>
            <div>
              <Button
                style={{
                  margin: "1em 0em 0em 0em",
                  backgroundColor: "white",
                  width: "0.5em",
                  height: "3em",
                  fontSize: "0.7em",
                }}
                variant="outlined"
                color="default"
                onClick={() => handleDelete(el.message_id)}
              >
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Complete;
