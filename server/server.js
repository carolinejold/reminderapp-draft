const express = require("express");
const app = express();
const port = 5000; // process.env.PORT ||
const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send({ message: "I AM A MESSAGE FROM EXPRESS" });
});

app.listen(port, () => console.log(`Server live on port ${port}`));

// const io = require('socket.io')();

// io.on('connection', (client) => {
//   // here you can start emitting events to the client
// });

// io.listen(port);
