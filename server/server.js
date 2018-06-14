const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the fight',
    createdAt: new Date().getTime()
  });
  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'A new challenger has appeared',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (message) => {
    console.log(message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    socket.broadcast.emit('newMessage', {
      from: 'Admin',
      text: 'A hero has been vanquished',
      createdAt: new Date().getTime()
    });
  });
});

server.listen(port, () => {
  console.log(`Express server listening on port ${port} in ${env} mode...`);
});
