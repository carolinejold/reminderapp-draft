"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const formatMessage = (user_id, name, list, task) => {
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
const users = [];
const userJoin = (user_id, name, list) => {
    const user = {
        user_id,
        name,
        list,
    };
    users.push(user);
    return user;
};
module.exports = { formatMessage, userJoin, users };
