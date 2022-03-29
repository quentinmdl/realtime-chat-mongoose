// Initialize & Configure Server
const express = require("express");
const path = require("path");
const app = express();

const { createServer } = require('http');
const server = createServer(app);

// Initialize & Configure MongoDB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/realtime-chat').then(
  console.log('Database connected')
).catch(err => console.log(err));

const Message = require("./models/message");
const User = require("./models/user");

// Initialize & Configure Socket
const { Server } = require("socket.io");
const io = new Server(server); 


// Configure Routes
app.get("/", function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "./public", "index.html"));
});


// Sockets
io.on("connection", (socket) => {
  Message.find().then((messages) => {
    // console.log(messages);
    socket.emit('msg', messages);
  })
  socket.on('new-user', (username) => {
    console.log(username + ' is connected');
    if(username) {
      const user = new User({user: {username: username}});
      user.save().then(() => {
        socket.broadcast.emit('user-connected', username);
      }).catch(err => console.log(err));
    }
  })
})

io.on('connection', (socket) => {
  socket.on('msg', (msg) => {
    const message = new Message({message: {content: msg.content, username: msg.username}});
    message.save().then(() => {
      io.emit('msg', msg);
    }).catch(err => console.log(err));
  });
});


// Listening 
server.listen("8101", function () {
  console.log("Server running");
});