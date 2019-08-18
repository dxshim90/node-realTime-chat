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

  socket.emit("message", "Welcome!");
  socket.broadcast.emit("message", "A New User Has Joined");

  socket.on("sendMessage", message => {
    io.emit("message", message);
  });

  socket.on("sendLocation", coords => {
    console.log(coords);
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.lat},${coords.long}`
    );
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
