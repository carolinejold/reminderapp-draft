import io from "socket.io-client";
const server = "http://localhost:5000/";

const socket = io(server, {
  upgrade: false,
  transports: ["websocket"],
});

export { socket };
