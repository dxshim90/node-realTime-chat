const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");

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

  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("Dont use bad words");
    }
    io.emit("message", message);
    callback("Delivered");
  });

  socket.on("sendLocation", (coords, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${coords.lat},${coords.long}`
    );
    callback("Location shared");
  });

  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
