const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

// const users = [];

interface ObjectType {
  user_id: string;
  message_id: string | number;
  name: string;
  room: string;
  task: string;
  date: string;
  time: string;
  completed: boolean;
}

const formatMessage = (
  user_id: string,
  name: string,
  room: string,
  task: string
): ObjectType => {
  return {
    user_id,
    message_id: uuidv4(),
    name,
    room,
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
