const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

import * as mongo from "mongodb";
const MongoClient = require("mongodb").MongoClient;
import { Socket } from "socket.io";

// const users = require("./utils/index.js").users;
const formatMessage = require("./utils/index.ts");
import { TaskObjType, UserType, DocumentType } from "./types/types";

// const userJoin = require("./utils/index.js");

const cors = require("cors");
require("dotenv").config();

app.use(cors());

const dbUsername: string | undefined = process.env.DB_USERNAME;
const dbPassword: string | undefined = process.env.DB_PASSWORD;
const dbName: string | undefined = process.env.DB_NAME;

const uri: string = `mongodb+srv://${dbUsername}:${dbPassword}@remindersapp.vswsy.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// TODO add client.close at some point?

const client: mongo.MongoClient = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);

let collection: any;
console.log('THIS IS COLLECTION', collection);

// PORT
const port = process.env.PORT || 5000;
server.listen(port, async () => {
  try {
    await client.connect();
    collection = client.db("remindersdb").collection("tasks");
    console.log(`Server running on port ${port}`);
  } catch (e) {
    console.error('Unable to connect to MongoDB', e);
  }
});

// Helper function
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

// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connect", (socket: Socket) => {
  // console.log("CONNECTED TO SERVER", socket.id);
  socket.on("new_user", async ({ name, list }) => {
    const user: UserType = userJoin(socket.id, name, list);
    try {
      // 1. Find pending tasks list from DB on new_user, create one if doesn't exist
      const pendingDocument: string = user.list;
      let pendingResult: DocumentType = await collection.findOne({ _id: pendingDocument });
      if (!pendingResult) {
        await collection.insertOne({ _id: pendingDocument, tasks: [] });
      }
      const pendingData = pendingResult.tasks;
      io.to(user.list).emit("show_pending_tasks", pendingData);

      // 2. Find completed tasks list from DB on new_user, create one if doesn't exist
      const completedDocument: string = `${user.list}Completed`;
      let completedResult: DocumentType = await collection.findOne({
        _id: completedDocument,
      });
      if (!completedResult) {
        await collection.insertOne({
          _id: completedDocument,
          tasks: [],
        });
      }
      const completedData = completedResult.tasks;
      io.to(user.list).emit("show_completed_tasks", completedData);

      // User joins list 'room'
      socket.join(user.list);      

      socket.emit(
        "welcome_user",
        `Welcome to the ${user.list} list, ${user.name}!`
      );

      io.to(user.list).emit(
        "user_joined",
        `${user.name} joined the ${user.list} list!`
      );

      // socket.activeRoom = room;
    } catch(e) {
      console.error(e);
    }
  });

  socket.on("client_message", (task) => {
    // console.log("USERS ARRAY INSIDE", users);
    const messageUser: TaskObjType | any = users.length !== 0 ? users.find((el) => el.user_id === socket.id) : null;
    const taskObj: TaskObjType = formatMessage(
      messageUser.user_id,
      messageUser.name,
      messageUser.list,
      task
    );
    try {
      // console.log("TASKOBJ:", taskObj);
      collection.updateOne(
        { _id: taskObj.list },
        { $push: { tasks: taskObj } }
      );
      io.to(taskObj.list).emit("server_message", taskObj);
    } catch (e) {
      console.error(e);
    }
  });

  // REWORK THIS
  socket.on("pending_tasks", (pendingTasks) => {
    // console.log("PENDING TASKS:", data);
    const originalRoom: string = pendingTasks[0].list;
    try {
      if (pendingTasks.length !== 0) {
        collection.updateMany({ _id: originalRoom }, { $set: { tasks: pendingTasks } });
      }
      io.to(originalRoom).emit("update_pending", pendingTasks);
    } catch (e) {
      console.error(e);
    }

    // let result = await collection.findOne({ _id: user.room });
    //   // console.log("mongoDB find collection:", result);
    //   if (!result) {
    //     await collection.insertOne({ _id: user.room, tasks: [] });
    //   }
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

  // EVENT HANDLER: When client disconnects. must be inside io.on connect

  // ROUTES
  // app.get("/chat", async (req, res) => {
  //   try {
  //     let result = await collection.findOne({ _id: req.query.room });
  //     res.send(result);
  //   } catch (e) {
  //     res.status(500).send({ message: e.message });
  //   }
  // });
});
