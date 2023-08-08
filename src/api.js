const express = require("express");
const serverless = require("serverless-http");
const socketIO = require('socket.io');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: '*' // Replace with your allowed origin
}));
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});
const server = http.createServer(app);
const io = socketIO(server);

// Event handler for new socket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Event handler for disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });

  // Event handler for custom message event from the client
  socket.on('message', (data) => {
    console.log('Received message from client:', data);

    // Broadcast the message to all connected clients (excluding the sender)
    socket.broadcast.emit('message', data);
  });
});
app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
