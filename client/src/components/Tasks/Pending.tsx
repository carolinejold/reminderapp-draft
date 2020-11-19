import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { socket } from "../sockets/sockets";
import { TaskObjType } from "../../types/types";
import "./Pending.css";

const Task: React.FC<{
  pendingArr: Array<TaskObjType>;
  setPendingArr: React.Dispatch<React.SetStateAction<TaskObjType[]>>;
}> = ({ pendingArr }) => {
  // TODO how can i make this more robust - message_id?
  const toggleTask = (id: string) => {
    const pendingTasks: Array<TaskObjType> = [];
    let completedTask: TaskObjType = {
      user_id: "",
      message_id: "",
      name: "",
      list: "",
      task: "",
      date: "",
      time: "",
      completed: false,
    };
    const newArray = pendingArr.map((el) => {
      if (el.message_id !== id) {
        return el;
      } else {
        return {
          user_id: el.user_id,
          message_id: el.message_id,
          name: el.name,
          list: el.list,
          task: el.task,
          date: el.date,
          time: el.time,
          completed: true,
        };
      }
    });

    newArray.forEach((el) => {
      if (el.completed) {
        completedTask = el;
      } else {
        pendingTasks.push(el);
      }
    });
    // const pendingTasks = pendingArr.filter(el => el.message_id !== id);
    // const completedTask = pendingArr.find((el) => el.message_id !== id);
    socket.emit("pending_tasks", pendingTasks);
    socket.emit("completed_task", completedTask);
  };

  return (
    <div className="task-container">
      {pendingArr.map((el) => {
        return (
          <div
            key={el.message_id}
            id={el.message_id}
            className="task-div"
            style={{
              textDecoration: el.completed ? "line-through" : "",
            }}
            onClick={() => toggleTask(el.message_id)}
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
