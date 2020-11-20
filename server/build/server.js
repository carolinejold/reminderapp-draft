"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const MongoClient = require("mongodb").MongoClient;
const { formatMessage, userJoin, users } = require("./utils");
const cors = require("cors");
require("dotenv").config();
app.use(cors());
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@remindersapp.vswsy.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// TODO add client.close at some point?
const client = new MongoClient(uri, { useUnifiedTopology: true }, { useNewUrlParser: true });
let collection;
// PORT
const port = process.env.PORT || 5000;
server.listen(port, async () => {
    try {
        await client.connect();
        collection = client.db("remindersdb").collection("tasks");
        // console.log(collection)
        console.log(`Server running on port ${port}`);
    }
    catch (e) {
        console.error("Unable to connect to MongoDB", e);
    }
});
// Helper function
// const users: Array<UserType> = [];
// const userJoin = (user_id: string, name: string, list: string): UserType => {
//   const user: UserType = {
//     user_id,
//     name,
//     list,
//   };
//   users.push(user);
//   return user;
// };
// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connect", (socket) => {
    // console.log("CONNECTED TO SERVER", socket.id);
    socket.on("new_user", async ({ name, list }) => {
        const user = userJoin(socket.id, name, list);
        try {
            // 1. Find pending tasks list from DB on new_user, create one if doesn't exist
            const pendingDocument = user.list;
            // console.log('PENDING DOC', pendingDocument)
            let pendingResult = await collection.findOne({
                _id: pendingDocument,
            });
            if (!pendingResult) {
                await collection.insertOne({
                    _id: pendingDocument,
                    tasks: [],
                    completed: [],
                });
                pendingResult = await collection.findOne({ _id: pendingDocument });
            }
            socket.emit("show_pending_tasks", pendingResult.tasks);
            socket.emit("show_completed_tasks", pendingResult.completed);
            // User joins list 'room'
            socket.join(user.list);
            socket.emit("welcome_user", `Welcome to the ${user.list} list, ${user.name}!`);
            io.to(user.list).emit("user_joined", `${user.name} joined the ${user.list} list!`);
            // socket.activeRoom = room;
        }
        catch (e) {
            console.error(e);
        }
    });
    socket.on("client_message", (task) => {
        // console.log("USERS ARRAY INSIDE", users);
        const messageUser = users.find((el) => el.user_id === socket.id);
        const taskObj = messageUser
            ? formatMessage(messageUser.user_id, messageUser.name, messageUser.list, task)
            : undefined;
        try {
            // console.log("TASKOBJ:", taskObj);
            if (taskObj) {
                collection.updateOne({ _id: taskObj.list }, { $push: { tasks: taskObj } });
                io.to(taskObj.list).emit("server_message", taskObj);
            }
        }
        catch (e) {
            console.error(e);
        }
    });
    // REWORK THIS
    socket.on("pending_tasks", (pendingTasks, list) => {
        // console.log("pending ping", pendingTasks);
        try {
            //   console.log("if pending ping");
            collection.updateOne({ _id: list }, { $set: { tasks: pendingTasks } });
            io.to(list).emit("update_pending", pendingTasks);
        }
        catch (e) {
            console.error(e);
        }
    });
    socket.on("completed_task", async (completedTask, list) => {
        try {
            await collection.updateOne({ _id: list }, { $push: { completed: completedTask } });
            const data = await collection.findOne({ _id: list });
            const completedTasks = data.completed;
            // console.log("COMPLETEKRLEKLKDD", completedTasks);
            io.to(list).emit("update_completed", completedTasks);
        }
        catch (e) {
            console.error(e);
        }
    });
    socket.on("delete_task", async (updatedCompleted, list) => {
        try {
            collection.updateOne({ _id: list }, { $push: { completed: updatedCompleted } });
            io.to(list).emit("update_completed", updatedCompleted);
        }
        catch (e) {
            console.error(e);
        }
    });
    // socket.on("completed_tasks", async (data) => {
    //   const roomName = `${data[0].room}Complete`;
    //   let result = await collection.findOne({ _id: roomName });
    //   // console.log("mongoDB find collection:", result);
    //   if (!result) {
    //     await collection.insertOne({ _id: roomName, tasks: data });
    //   }
    //   collection.updateMany({ _id: roomName }, { $set: { tasks: data } });
    //   io.emit("update_completed", data);
    // });
    // socket.on("delete_task", (taskArr) => {
    // somrhing between this:
    // collection.remove({"_id": new mongodb.ObjectId(id)});
    // and this:
    // collection.remove({ _id: roomName }, { $set: { tasks: data } });
    //   io.emit("deleted_task", taskArr);
    // });
    //   io.on("disconnect", (socket) => {
    //     // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
    //     socket.broadcast.emit("user_left", `ANOTHER USER is no longer online`);
    //   });
    // });
});
