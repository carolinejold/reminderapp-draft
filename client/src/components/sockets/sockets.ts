import io from "socket.io-client";
const server = "http://localhost:5000/";

// http://localhost:5000/
// "https://git.heroku.com/reminders-app-co.git"

const socket = io(server, {
  transports: ["websockets"],
  upgrade: false
});

export { socket };
