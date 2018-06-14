const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the fight'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new challenger has appeared'));

  socket.on('createMessage', (message, callback) => {
    console.log(message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback(message.text);
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'A hero has fallen'));
  });
});

server.listen(port, () => {
  console.log(`Express server listening on port ${port} in ${env} mode...`);
});
