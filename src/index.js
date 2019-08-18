const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));
// let count = 0;
io.on("connection", socket => {
  console.log("New Socket Connction");

  socket.emit("welcomeMessage", "Welcome!");

  socket.on("sendMessage", message => {
    io.emit("message", message);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
