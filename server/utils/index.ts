const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
import { TaskObjType } from "../types/types.js";

// const users = [];

const formatMessage = (
  user_id: string,
  name: string,
  list: string,
  task: string
): TaskObjType => {
  return {
    user_id,
    message_id: uuidv4(),
    name,
    list,
    task,
    date: moment().format("DD-MM-YYYY"),
    time: moment().format("HH:mm"),
    completed: false,
  };
};

// const userJoin = (user_id, name, room) => {
//   const user = { user_id, name, room };
//   users.push(user);
//   return user;
// };

module.exports = formatMessage;
// module.exports = userJoin;
// module.exports = users;
