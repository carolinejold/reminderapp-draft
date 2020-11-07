const express = require("express");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// CORS
const cors = require("cors");
app.use(cors());

// ROUTES
// app.get("/", (req, res) => {
//   res.send({ message: "I AM A MESSAGE FROM EXPRESS" });
// });

// SOCKET.IO - WHEN CLIENT CONNECTS
io.on("connection", (socket) => {
  // Welcome current user
  socket.emit("welcome", "welcome to the chatroom wooo!!");
  // Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  // EVENT HANDLER: 1) When client submits a message from form
  socket.on("client_message", (message) => {
    console.log("from server:", message);
    io.emit("server_message", message);
  });

  // Runs when client disconnects - this must be inside the connection event
  io.on("disconnect", (socket) => {
    // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
    socket.broadcast.emit("message", "A user has left the chat");
  });
});

// PORT
const port = 5000 || process.env.PORT;
server.listen(port, () => console.log(`Server running on port ${port}`));
