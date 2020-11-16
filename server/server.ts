export {};

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
const formatMessage = require("./utils/index.js");
import { TaskObjType, UserType } from "./types/types";

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

// Helper Functions

const users: Array<object> = [];
const userJoin = (user_id: string, name: string, room: string): UserType => {
  const user: UserType = {
    user_id,
    name,
    room,
  };
  users.push(user);
  return user;
};

// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connect", (socket: Socket) => {
  // console.log("CONNECTED TO SERVER", socket.id);
  socket.on("new_user", async ({ name, room }) => {
    const user: UserType = userJoin(socket.id, name, room);
    // console.log("User details, new_user, server", user);
    try {
      let pendingResult = await collection.findOne({ _id: user.room });
      if (!pendingResult) {
        await collection.insertOne({ _id: user.room, tasks: [] });
      }
      // console.log("mongoDB find collection:", result);
      const completedName: string = `${user.room}Completed`;
      let completedResult = await collection.findOne({
        _id: completedName,
      });
      // console.log("mongoDB find collection:", result);
      if (!completedResult) {
        await collection.insertOne({
          _id: completedName,
          tasks: [],
        });
      }
      socket.join(user.room);

      collection.find({ _id: user.room }).toArray((e: object, res: []) => {
        if (e) {
          throw e;
        }
        const dbTasksPending: TaskObjType = res[0].tasks; // this is task list from db
        // console.log("RES FROM LINE 73", dbTasks);
        io.to(user.room).emit("showDbTasksPending", dbTasksPending);
      });

      collection.find({ _id: completedName }).toArray((e: object, res: []) => {
        if (e) {
          throw e;
        }
        const dbTasks: TaskObjType = res[0].tasks; // this is task list from db
        // console.log("RES FROM LINE 73", dbTasks);
        io.to(user.room).emit("showDbTasks", dbTasks);
      });

      socket.emit(
        "welcome_user",
        `Welcome to the ${user.room} list, ${user.name}!`
      );

      io.to(user.room).emit(
        "user_joined",
        `${user.name} joined the ${user.room} list!`
      );

      // socket.activeRoom = room;
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("client_message", (task) => {
    // console.log("USERS ARRAY INSIDE", users);
    const messageUser: any = users.find((el) => el.user_id === socket.id);
    const taskObj: TaskObjType = formatMessage(
      messageUser.user_id,
      messageUser.name,
      messageUser.room,
      task
    );
    try {
      // console.log("TASKOBJ:", taskObj);
      collection.updateOne(
        { _id: taskObj.room },
        { $push: { tasks: taskObj } }
      );
      io.to(taskObj.room).emit("server_message", taskObj);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("pending_tasks", (data) => {
    // console.log("PENDING TASKS:", data);
    const originalRoom: string = data[0].room;
    try {
      if (data.length !== 0) {
        collection.updateMany({ _id: originalRoom }, { $set: { tasks: data } });
      }
      io.to(originalRoom).emit("update_pending", data);
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
