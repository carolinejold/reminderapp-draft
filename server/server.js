const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const cors = require("cors");
require("dotenv").config();

app.use(cors());

const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@remindersapp.vswsy.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// TODO add client.close at some point?

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);

let collection;

// PORT
const port = process.env.PORT || 5000;
server.listen(port, async () => {
  try {
    await client.connect();
    collection = client.db("remindersdb").collection("tasks");
    console.log(`Server running on port ${port}`);
  } catch (e) {
    console.error(e);
  }
});

const formatMessage = require("./utils/messages.js");

// HELPER FUNCTIONS
const users = [];
const userJoin = (user_id, name, room) => {
  const user = { user_id, name, room };
  users.push(user);
  // console.log("USERS ARRAY OUTSIDE", users);
  return user;
};

// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connect", (socket) => {
  console.log("CONNECTED TO SERVER", socket.id);

  socket.on("new_user", async ({ name, room }) => {
    const user = userJoin(socket.id, name, room);
    // console.log("User details, new_user, server", user);
    try {
      let result = await collection.findOne({ _id: user.room });
      // console.log("mongoDB find collection:", result);
      if (!result) {
        await collection.insertOne({ _id: user.room, tasks: [] });
      }
      socket.join(user.room);

      collection.find({ _id: user.room }).toArray((err, res) => {
        if (err) {
          throw err;
        }
        const dbTasks = res[0].tasks; // this is task list from db
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

      socket.activeRoom = room;
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("client_message", (task) => {
    // console.log("USERS ARRAY INSIDE", users);
    const messageUser = users.find((el) => el.user_id === socket.id);
    const taskObj = formatMessage(
      messageUser.user_id,
      messageUser.name,
      messageUser.room,
      task
    );
    try {
      console.log("TASKOBJ:", taskObj);
      collection.updateOne(
        { _id: taskObj.room },
        { $push: { tasks: taskObj } }
      );
      io.emit("server_message", taskObj);
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("pending_tasks", (data) => {
    io.emit("update_pending", data);
    console.log("PENDING TASKS:", data);
    const roomName = `${data[0].room}Complete`;
    // console.log("DATA 0 DOT ROOM:", data[0].room);
    if (data.length !== 0) {
      collection.updateMany({ _id: data[0].room }, { $set: { tasks: data } });
    }
  });

  socket.on("completed_tasks", async (data) => {
    const roomName = `${data[0].room}Complete`;
    let result = await collection.findOne({ _id: `${roomName}` });
    // console.log("mongoDB find collection:", result);
    if (!result) {
      await collection.insertOne({ _id: `${roomName}`, tasks: data });
    }
    collection.updateMany({ _id: `${roomName}` }, { $set: { tasks: data } });
    io.emit("update_completed", data);
  });

  // socket.on("delete_task", (taskArr) => {
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
