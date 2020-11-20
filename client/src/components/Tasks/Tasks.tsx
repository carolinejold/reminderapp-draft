import React, { useEffect, useState } from "react";
import { socket } from "../sockets/sockets";
import Pending from "./Pending";
import Complete from "./Complete";
import { TaskObjType } from "../../types/types";
import "./Tasks.css";

const Tasks: React.FC<{ list: string | null }> = ({ list }) => {
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

    socket.on("update_completed", (data: Array<TaskObjType>) => {
      setCompletedArr(data);
    });
  }, []);

  return (
    <div className="tasks-container">
      <Pending list={list} pendingArr={pendingArr} />
      <p className="tasks-divider">- Completed Tasks -</p>
      <Complete list={list} completedArr={completedArr} />
    </div>
  );
};

export default Tasks;
