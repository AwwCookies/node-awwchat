/**
 * Created by aww on 12/26/2016.
 */
let socket = io(); // Connect to Server

socket.on("sendUserData", () => {
  socket.emit("UserData", {
    username: "AwwCookies"
  }, (error) => {
  console.log(error);
})
});