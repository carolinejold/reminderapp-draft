import io from "socket.io-client";
const server = "window.location.hostname";

// http://localhost:5000/
// "https://git.heroku.com/reminders-app-co.git"

const socket = io(server, {
  transports: ["websockets"],
});

export { socket };

//   upgrade: false,
