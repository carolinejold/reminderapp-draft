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
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@remindersapp.vswsy.mongodb.net/${dbName}?retryWrites=true&w=majority`; // TODO move username (remindersAppUser), password (remindersAppUserPassword) and db (remindersapp) to .env file after dotenv installed. CHECK IF THIS IS THE CORRECT DATABASE NAME?? could be remindersapp?. i think remindersapp is the cluster.

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
    console.log("User details, new_user, server", user);
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
        // console.log("RES FROM LINE 81", dbTasks);
        io.to(user.room).emit("showDbTasks", dbTasks);
      });

      socket.emit(
        "welcome_user",
        `Welcome to the ${user.room} list, ${user.name}!`
      );

      socket.broadcast
        .to(user.room)
        .emit("user_joined", `${user.name} joined the ${user.room} list!`);

      socket.activeRoom = room;
    } catch (e) {
      console.error(e);
    }
  });

  socket.on("client_message", (task) => {
    // console.log("USERS ARRAY INSIDE", users);
    const messageUser = users.find((el) => el.user_id === socket.id);
    const taskObj = formatMessage(messageUser.user_id, messageUser.name, task);
    socket.emit("server_message", taskObj);
    try {
      console.log(messageUser.room, taskObj);
      collection.updateOne(
        { _id: messageUser.room },
        { $push: { tasks: taskObj } }
      );
    } catch (e) {
      console.error(e);
    }
  });

  // socket.on("toggle_task", (taskArr) => {
  //   // 1. replace all of the documents in the db with the new taskArr
  //   // 2. best case: instead of adding task to tasks collection/replacing all docs in the collection, replace the OBJECT with the message_id equal to the one which has been changed

  //   // const toggledTask = this is the object which has been altered. 
  //   // replace the current object in the array with teh SAME MESSAGE ID, with this new toggledTask

  //   // toggledTask.message_id 

  //   // NEW PLAN FOR TOGGLED TASKS !!!!!!!!!!!!!
  //   // TASK TOGGLED - MAKE IT IRREVERSIBLE
  //   // AS SOON AS IT IS TOGGLED, REMOVE IT FROM THE COLLECTION AND ADD IT TO A NEW COLLECTION ( which will be loaded within a new component, Complete.js, added to the bottom of the List.js page )
  //   // 

  //   io.emit("toggled_task", taskArr);
  // });

  // socket.on("delete_task", (taskArr) => {
  //   io.emit("deleted_task", taskArr);
  // });

  //   io.on("disconnect", (socket) => {
  //     // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
  //     socket.broadcast.emit("user_left", `ANOTHER USER is no longer online`);
  //   });
});

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
