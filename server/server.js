const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const cors = require("cors");

// CORS
app.use(cors());

// // MONGODB - traversy
// const MongoClient = require("mongodb").MongoClient;

// MongoClient.connect(
//   "mongodb://localhost:5000/mongochat?authSource=admin",
//   (err, db) => {
//     if (err) {
//       throw err;
//     }
//     console.log("MongoDB connected");
//   }
// );

////////////// from MONGODB DOCUMENTATION /////////////

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://remindersAppUser:remindersAppUserPassword@remindersapp.vswsy.mongodb.net/remindersdb?retryWrites=true&w=majority"; // TODO move username (remindersAppUser), password (remindersAppUserPassword) and db (remindersapp) to .env file after dotenv installed. CHECK IF THIS IS THE CORRECT DATABASE NAME?? could be remindersapp?. i think remindersapp is the cluster.

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);

// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
//////////////////////////////////////////////////////
let collection;

// PORT
const port = 5000 || process.env.PORT;
server.listen(port, async () => {
  try {
    await client.connect();
    collection = client.db("remindersdb").collection("tasks");
    console.log(`Server running on port ${port}`);
  } catch (e) {
    console.error(e);
  }
});

// ROUTES
app.get("/chat", async (req, res) => {
  try {
    let result = await collection.findOne({ _id: req.query.room }); // we want to find a single document based on the room value that was passed in with the request. This single document will have all of our previous chat conversations for the particular room. ALL MESSAGE OBJECTS MUST BE PUSHED INTO THAT DOCUMENT WITH THAT _id GIVEN TO IT BY MONGODB.
    res.send(result);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

const formatMessage = require("./utils/messages.js");

////////////////////////////////////
// HELPER FUNCTIONS
const users = [];

const userJoin = (user_id, name, room) => {
  const user = { user_id, name, room };
  users.push(user);
  console.log("USERS ARRAY OUTSIDE", users);
  return user;
};
////////////////////////////////////

// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connect", (socket) => {
  console.log("CONNECTED TO SERVER", socket.id);

  socket.on("new_user", async ({ name, room }) => {
    const user = userJoin(socket.id, name, room);
    console.log("User details, new_user, server", user);
    try {
      let result = await collection.findOne({ _id: user.room });
      console.log("mongoDB find collection:", result);
      if (!result) {
        await collection.insertOne({ _id: user.room, tasks: [] });
      }
      socket.join(user.room);
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
    console.log("USERS ARRAY INSIDE", users);
    const messageUser = users.find((el) => el.user_id === socket.id);
    console.log("messageUser:", messageUser);
    const taskObj = formatMessage(messageUser.user_id, messageUser.name, task);
    console.log("taskObj:", taskObj);
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
  //   io.emit("toggled_task", taskArr);
  // });
});

// EVENT HANDLER: When client disconnects. must be inside io.on connect
//   io.on("disconnect", (socket) => {
//     // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
//     socket.broadcast.emit("user_left", `ANOTHER USER is no longer online`);
//   });
