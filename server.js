/**
 * Created by aww on 12/26/2016.
 */

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const {User} = require("./user");

const validator = require("validator");
const _ = require("lodash");


let users = [];
let channels = [];

app.use(express.static('static'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/templates/index.html');
});

io.on('connection', function (socket) {
  console.log('a user connected');
  socket.emit("sendUserData"); // Request Initial user data

  socket.on("UserData", (userData, callback) => {
    if (validator.isAscii(userData.username)) {
      if (_.find(users, {username: userData.username})) {
        callback({status: "error" , message:"Username already taken"});
      } else {
        let user = new User(io, socket, userData.username).then((user) => {
          user.joinChannel("#Aww");
          user.joinChannel("#freenode");
          user.joinChannel("#freenude");
          users.push(user);
        });
        callback({status: "success", message: `Connect to server as ${userData.username}`})
      }
    } else {
      callback({status: "error", message: "Invalid Username"});
    }
  });

});

http.listen(process.env.PORT || 3000, function () {
  console.log('listening on *:3000');
});