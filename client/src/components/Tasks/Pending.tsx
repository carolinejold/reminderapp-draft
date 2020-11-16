import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { socket } from "../sockets/sockets.js";
import { TaskObjType } from "../../types/types";
import "./Pending.css";

const Task: React.FC<{ pendingArr: Array<TaskObjType> }> = ({ pendingArr }) => {
  // TODO how can i make this more robust - message_id?
  const toggleTask = (i: number) => {
    const currentTasks = [...pendingArr];
    currentTasks[i].completed = true; // !currentTasks[i].completed;
    // const completedTasks = taskArr.filter((el) => el.completed === true);
    const pendingTasks = pendingArr.filter((el) => el.completed === false);
    socket.emit("pending_tasks", pendingTasks);
    // socket.emit("completed_tasks", completedTasks);
  };

  return (
    <div className="task-container">
      {pendingArr.map((el, i) => {
        return (
          <div
            data-i={i}
            key={el.message_id}
            id={el.message_id}
            className="task-div"
            style={{
              textDecoration: el.completed ? "line-through" : "",
            }}
            onClick={() => toggleTask(i)}
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
                // onClick={handleClick}
              >
                {/* {toggleExtra === true ? "Hide details" : "More details"} */}
                Delete
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Task;
