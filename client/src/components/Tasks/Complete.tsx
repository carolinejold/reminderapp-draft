import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { TaskObjType } from "../../types/types";
import { socket } from "../sockets/sockets";
import "./Complete.css";

const Complete: React.FC<{ completedArr: Array<TaskObjType> }> = ({
  completedArr,
}) => {
  const handleDelete = (id: string) => {
    const list = completedArr[0].list;
    const updatedCompleted = completedArr.filter((el) => el.message_id !== id);
    console.log("UPDAAATED COMPLEEEETED", updatedCompleted);
    socket.emit("delete_task", updatedCompleted, list);
  };

  return (
    <div className="completed-container">
      {completedArr.map((el) => {
        return (
          <div
            key={el.message_id}
            id={el.message_id}
            className="completed-div"
            style={{
              textDecoration: el.completed ? "line-through" : "",
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

export default Complete;
