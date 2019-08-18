const socket = io();

socket.on("message", message => {
  console.log(message);
});

const form = document.querySelector("#message-form");
form.addEventListener("submit", e => {
  e.preventDefault();
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message);
});

const locationButton = document.querySelector("#send-location");

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }

  navigator.geolocation.getCurrentPosition(position => {
    socket.emit("sendLocation", {
      lat: position.coords.latitude,
      long: position.coords.longitude
    });
  });
});
