import React from "react";

const Message = ({ receivedMessage }) => {
  return (
    <div>
      {receivedMessage.map((el, i) => {
        return (
          <div key={i} style={{ textAlign: 'center', border: 'solid 1px', borderRadius: '10px', padding: '0.5em'}}>
            <p>{el}</p>
          </div>
        );
      })}
    </div>
  );
};

export default Message;
