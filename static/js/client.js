/**
 * Created by aww on 12/26/2016.
 */
let socket = io(); // Connect to Server
let buffer = undefined;
let buffers = {};
let inputBuffer = [];


socket.on("sendUserData", () => {
  socket.emit("UserData", {
    username: "AwwCookies" + parseInt(Math.random() * 100)
  }, (data) => {
    console.log(data);
    if (data.status == "success") {
      alertify.success(data.message)
    } else if (data.status == "error") {
      alertify.error(data.message)
    } else {
      alertify.error("Something weird happened.... " + data.message)
    }
  })
});

socket.on("youJoinedChannel", (channel) => {
  console.log(`I joined a channel`);
  $(".channel-list").append(Mustache.render($("#channel-template").html(), channel));
});

socket.on("newUserMessage", (message) => {
  console.log(message.channel, buffer);
  let msg = {
    timestamp: message.timestamp,
    id: message.id,
    channel: message.channel,
    username: message.username,
    text: message.text
  };
  if (message.channel === buffer) {
    console.log(`New message`, message);
    $("#message-list").append(Mustache.render($("#message-template").html(), msg));
  }
  if (buffers[message.channel] == undefined) {
    buffers[message.channel] = [];
    buffers[message.channel].push(msg)
  } else {
    buffers[message.channel].push(msg)
  }
  console.log("Got channel message", message);
  scrollToBottom()
});

function onChannelClick(e) {
  let chanBtn = $(".channel-list").children(`#channel-${e.replace("#", "")}`);
  chanBtn.css({"background-color": "red"});
  buffer = e;
  $("#message-list").empty();
  buffers[e].forEach((message) => {
    $("#message-list").append(Mustache.render($("#message-template").html(), message));
  })
}

function inputParser() {
  let inputField = $("#input");
  let inputText = inputField.val();
  inputBuffer.push(inputText);
  inputField.val("");

  if (inputText.startsWith("/")) {

  } else {
    if (buffer === undefined) {
      alertify.error("Please select a channel")
    } else {
      socket.emit("message", {text: inputText, channel: buffer})
    }
  }
}

//socket.on("joinedChannel", (data) => {

//});