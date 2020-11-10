const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

console.log(uuidv4());
const formatMessage = (user_id, name, task) => {
  return {
    user_id,
    message_id: uuidv4(),
    name,
    task,
    date: moment().format("DD-MM-YYYY"),
    time: moment().format("HH:mm"),
    completed: false,
  };
};

module.exports = formatMessage;
