const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
import { TaskObjType, UserType } from "../types/types.js";

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

const users: Array<UserType> = [];
const userJoin = (user_id: string, name: string, list: string): UserType => {
  const user: UserType = {
    user_id,
    name,
    list,
  };
  users.push(user);
  return user;
};

module.exports = { formatMessage, userJoin, users };
