import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets";
import Pending from "./Pending";
import Complete from "./Complete";
import { TaskObjType } from "../../types/types";
import "./Tasks.css";

const Tasks: React.FC = () => {
  const [pendingArr, setPendingArr] = useState<Array<TaskObjType>>([]);
  const [completedArr, setCompletedArr] = useState<Array<TaskObjType>>([]);

  useEffect(() => {
    socket.on("show_pending_tasks", (pendingData: Array<TaskObjType>) => {
      setPendingArr(pendingData);
    });

    socket.on("show_completed_tasks", (completedData: Array<TaskObjType>) => {
      setCompletedArr(completedData);
    });

    socket.on("server_message", (taskObj: TaskObjType) => {
      setPendingArr((pendingArr) => [...pendingArr, taskObj]);
    });

    socket.on("update_pending", (pendingTasks: Array<TaskObjType>) => {
      setPendingArr(pendingTasks);
    });

    socket.on("update_completed", (completedTasks: Array<TaskObjType>) => {
      setCompletedArr(completedTasks);
    });
  }, []);

  return (
    <div className="tasks-container">
      <Pending pendingArr={pendingArr} setPendingArr={setPendingArr} />
      <p className="tasks-divider">- Completed Tasks -</p>
      <Complete completedArr={completedArr} />
    </div>
  );
};

export default Tasks;
