const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

import * as mongo from "mongodb";
const MongoClient = require("mongodb").MongoClient;
import { Socket } from "socket.io";

const { formatMessage, userJoin, users } = require("./utils");
import { TaskObjType, UserType, DocumentType } from "./types/types";

const cors = require("cors");
require("dotenv").config();

app.use(cors());

const dbUsername: string | undefined = process.env.DB_USERNAME;
const dbPassword: string | undefined = process.env.DB_PASSWORD;
const dbName: string | undefined = process.env.DB_NAME;

const uri: string = `mongodb+srv://${dbUsername}:${dbPassword}@remindersapp.vswsy.mongodb.net/${dbName}?retryWrites=true&w=majority`;

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
    console.error("Unable to connect to MongoDB", e);
  }
});

io.on("connect", (socket: Socket) => {
  socket.on("new_user", async ({ name, list }) => {
    const user: UserType = userJoin(socket.id, name, list);
    try {
      const pendingDocument: string = user.list;
      let pendingResult: DocumentType = await collection.findOne({
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

      socket.join(user.list);

      socket.emit(
        "welcome_user",
        `Welcome to the ${user.list} list, ${user.name}!`
      );

      io.to(user.list).emit(
        "user_joined",
        `${user.name} joined the ${user.list} list!`
      );

    } catch (e) {
      console.error(e);
    }
  });

  socket.on("client_message", (task: string) => {
    const messageUser: UserType | undefined = users.find(
      (el: UserType) => el.user_id === socket.id
    );
    const taskObj: TaskObjType = messageUser
      ? formatMessage(
          messageUser.user_id,
          messageUser.name,
          messageUser.list,
          task
        )
      : undefined;
    try {
      if (taskObj) {
        collection.updateOne(
          { _id: taskObj.list },
          { $push: { tasks: taskObj } }
        );
        io.to(taskObj.list).emit("server_message", taskObj);
      }
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("pending_tasks", (pendingTasks, list) => {
    try {
      collection.updateOne({ _id: list }, { $set: { tasks: pendingTasks } });
      io.to(list).emit("update_pending", pendingTasks);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("completed_task", async (completedTask, list) => {
    try {
      await collection.updateOne(
        { _id: list },
        { $push: { completed: completedTask } }
      );
      const data = await collection.findOne({ _id: list });
      const completedTasks = data.completed;
      io.to(list).emit("update_completed", completedTasks);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("delete_task", async (updatedCompleted, list) => {
    try {
      collection.updateOne(
        { _id: list },
        { $set: { completed: updatedCompleted } }
      );
      io.to(list).emit("update_completed", updatedCompleted);
    } catch (e) {
      console.error(e);
    }
  });


  //   io.on("disconnect", (socket) => {
  //     // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
  //     socket.broadcast.emit("user_left", `ANOTHER USER is no longer online`);
  //   });
  // });
});
