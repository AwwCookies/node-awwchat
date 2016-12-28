/**
 * Created by aww on 12/26/2016.
 */

const shortid = require("shortid");

class User {
  constructor(io, socket, username) {
    this.channels = [];
    return new Promise((resolve, reject) => {
      if (io && socket && username) {
        this.socket = socket;
        this.username = username;
        this.socket.on("message", (message) => {
          message.username = this.username;
          message.timestamp = new Date().getTime();
          message.id = shortid.generate();
          console.log(message);
          io.to(message.channel).emit("newUserMessage", message)
        });
        resolve(this)
      } else {
        reject(Error("Invalid Data"))
      }
    });
  }

  joinChannel(channel) {
    this.socket.join(channel, () => {
      this.socket.emit("youJoinedChannel", {"channel": channel});
    })
  }
}

module.exports = {
  User
};