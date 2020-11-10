const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const formatMessage = require("./utils/messages.js");

// CORS
const cors = require("cors");
app.use(cors());

////////////////////////////////////
// HELPER FUNCTIONS
const users = [];

const userJoin = (user_id, name, room) => {
  const user = { user_id, name, room };
  users.push(user);
  return user;
};
////////////////////////////////////

// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connect", (socket) => {
  console.log("CONNECTED TO SERVER", socket.id);

  socket.on("new_user", ({ name, room }) => {
    const user = userJoin(socket.id, name, room);

    console.log("User details, new_user, server", user);
    socket.join(user.room);
    socket.emit(
      "welcome_user",
      `Welcome to the ${user.room} list, ${user.name}!`
    );
    socket.broadcast
      .to(user.room)
      .emit("user_joined", `${user.name} joined the ${user.room} list!`);
  });

  socket.on("client_message", async (task) => {
    const user = await users.find((user) => user.user_id === socket.id);
    io.to(user.room).emit(
      "server_message",
      formatMessage(user.user_id, user.name, task)
    );
  });

  socket.on("toggle_task", (taskArr) => {
    io.emit("toggled_task", taskArr);
  });
});

// EVENT HANDLER: When client disconnects
//   io.on("disconnect", (socket) => {
//     // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
//     socket.broadcast.emit("user_left", `ANOTHER USER is no longer online`);
//   });

// DISCONNECT: Must be inside io-on connect

// // ROUTES
// app.get("/", (req, res) => {
//   res.send({ message: "I AM A MESSAGE FROM EXPRESS" });
// });

// PORT
const port = 5000 || process.env.PORT;
server.listen(port, () => console.log(`Server running on port ${port}`));
