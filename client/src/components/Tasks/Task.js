import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
// import { socket } from "../sockets/sockets.js";
import "./Task.css";

const Task = ({ taskArr, setTaskArr }) => {
  // TODO how can i make this more robust - message_id?
  // const toggleTask = (i) => {
  //   const currentTasks = [...taskArr];
  //   currentTasks[i].completed = !currentTasks[i].completed;
  //   const completedTasks = taskArr.filter((el) => el.completed === true);
  //   const pendingTasks = taskArr.filter((el) => el.completed === false);

  //   setTaskArr(pendingTasks);

  //   // setTaskArr(taskArr);
  //   // console.log('COMPLETED TASKS', completedTasks)
  //   socket.emit("toggle_task", { taskArr, completedTasks });
  // };

  return (
    <div className="task-container">
      {taskArr.map((el, i) => {
        return (
          <div
            i={i}
            key={el.message_id}
            id={el.message_id}
            className="task-div"
            // style={{
            //   textDecoration: el.completed ? "line-through" : "",
            //   order: el.completed ? "1" : "0", // NOT WORKING
            // }}
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
                  fontWeight: "400",
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
