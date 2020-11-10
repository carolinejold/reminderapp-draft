const moment = require("moment");

const formatMessage = (id, name, task) => {
  return {
    id,
    name,
    task,
    date: moment().format("YYYY-MM-DD HH:mm")
  };
};

module.exports = formatMessage;
