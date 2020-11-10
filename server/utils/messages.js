const moment = require("moment");

const formatMessage = (id, name, task) => {
  return {
    id,
    name,
    task,
    time: moment().format("h:mm a"),
  };
};

module.exports = formatMessage;
