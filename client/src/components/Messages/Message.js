import React from "react";

const Message = ({ receivedMessage }) => {
  const styles = {
    div: {
      textAlign: "center",
      border: "solid 1px",
      borderRadius: "10px",
      padding: "2em, 1em, 2em, 1em",
      margin: "0.5em",
      maxWidth: "20em",
      maxHeight: "7em",
      overflowY: "scroll",
      fontSize: '0.8em'
    },
  };

  return (
    <div>
      {receivedMessage.map((el, i) => {
        return (
          <div key={i} style={styles.div}>
            <i>{el.id}</i>
            <p>{el.message}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Message;
