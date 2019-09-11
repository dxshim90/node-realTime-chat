const socket = io();

const form = document.querySelector("#message-form");
const messageInput = form.querySelector("input");
const messageButton = form.querySelector("button");
const messages = document.querySelector("#messages");

const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

socket.on("message", message => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", message => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("h:mm a")
  });
  messages.insertAdjacentHTML("beforeend", html);
});

form.addEventListener("submit", e => {
  e.preventDefault();
  messageButton.setAttribute("disabled", "disabled");
  //diable
  const message = e.target.elements.message.value;
  socket.emit("sendMessage", message, error => {
    messageButton.removeAttribute("disabled");
    messageInput.value = "";
    messageInput.focus();
    if (error) {
      return console.log(error);
    }
    console.log("Message Delivered");
  });
});

const locationButton = document.querySelector("#send-location");

locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(position => {
    locationButton.removeAttribute("disabled");
    socket.emit(
      "sendLocation",
      {
        lat: position.coords.latitude,
        long: position.coords.longitude
      },
      () => {
        console.log("Location Shared");
      }
    );
  });
});

socket.emit("join", { username, room }, error => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
