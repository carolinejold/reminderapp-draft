import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import "./Complete.css";

const Complete = ({ completedArr }) => {
  return (
    <div className="completed-container">
      {completedArr.map((el, i) => {
        return (
          <div
            i={i}
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

export default Complete;
