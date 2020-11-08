const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { userJoin, currentUser } = require("./utils/users.js");

// CORS
const cors = require("cors");
app.use(cors());

// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connect", (socket) => {
  // EVENT HANDLER: 1) When client joins the room
  socket.on("join_room", ({ name, room }) => {
    const user = userJoin(socket.id, name, room);
    socket.join(user.room);

    // Welcome current user
    socket.emit(
      "welcome",
      `Welcome to the ${user.room} list, ${user.name}!`
    );
    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit("user-joined-chat", `${user.name} has joined the chat`);
  });

  // EVENT HANDLER: 2) When client submits a message from form
  socket.on("client_message", (data) => {
    console.log("from server:", data);
    io.emit("server_message", data); //{ id: socket.id, message: message, name: name }
  });

  // DISCONNECT: Must be inside io-on connect
  io.on("disconnect", (socket) => {
    // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
    socket.broadcast.emit("user_left", `ANOTHER USER is no longer online`);
  });
});

// PORT
const port = 5000 || process.env.PORT;
server.listen(port, () => console.log(`Server running on port ${port}`));

// ROUTES
// app.get("/", (req, res) => {
//   res.send({ message: "I AM A MESSAGE FROM EXPRESS" });
// });
