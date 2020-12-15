import React from "react";
import Divider from "@material-ui/core/Divider";
import { socket } from "../sockets/sockets";
import { TaskObjType } from "../../types/types";
import "./Pending.css";

const Task: React.FC<{
  pendingArr: Array<TaskObjType>;
  list: string | null;
}> = ({ pendingArr, list }) => {
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
    socket.emit("pending_tasks", pendingTasks, list);
    socket.emit("completed_task", completedTask, list);
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
          </div>
        );
      })}
    </div>
  );
};

export default Task;
