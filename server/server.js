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

// Join user to chat
const userJoin = (id, name, room) => {
  const user = { id, name, room };
  users.push(user);
  console.log("users array, server", users);
  return user;
};

// // Get current user
// const currentUser = (id) => {
//   console.log("USERS ARRAY 2", users);
//   return users.find((user) => user.id === id);
// };
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


  // EVENT HANDLER: When client disconnects
  //   io.on("disconnect", (socket) => {
  //     // TODO here: 1. Remove the user ID 2. Send message to the rest that the user is no longer present
  //     socket.broadcast.emit("user_left", `ANOTHER USER is no longer online`);
  //   });
});

//   // Welcome current user
//   socket.emit("welcome", `Welcome to the ${user.room} list, ${user.name}!`);

//   // Broadcast when a user connects
//   socket.broadcast
//     .to(user.room)
//     .emit("user-joined-chat", `${user.name} has joined the chat`);
// });

// EVENT HANDLER: 2) When client submits a message from form
// socket.on("client_message", (message) => {
//   console.log("USSSSSSSSERRS", users); // [ { id: 'VJ96XJ2SPkGFb6xtAAAJ', name: 'caroilne', room: 'groceries' } ], this is working fine
//   console.log("ID WITHIN USERS", socket.id);
//   const user = users.find((user) => user.id === socket.id); // find - Returns the value of the first element in the array where predicate is true, and undefined otherwise.
//   console.log("CURRENT USER VAR", user); // ERROR The socket.id is different from the user.id - why is this
//   io.to(user.room).emit("server_message", formatMessage(user.name, message)); //{ id: socket.id, message: message, name: name }
// });

// DISCONNECT: Must be inside io-on connect

// // ROUTES
// app.get("/", (req, res) => {
//   res.send({ message: "I AM A MESSAGE FROM EXPRESS" });
// });

// PORT
const port = 5000 || process.env.PORT;
server.listen(port, () => console.log(`Server running on port ${port}`));
