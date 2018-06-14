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

  // socket.emit('newEmail', {
  //   from: 'JT',
  //   body: 'Yo dude',
  //   createdAt: 123
  // });
  socket.emit('newMessage', {
    from: 'JT',
    body: 'Yo dude',
    createdAt: new Date()
  });

  socket.on('newMessage', (message) => {
    console.log(message);
  });

  // socket.on('newEmail', (email) => {
  //   console.log(email);
  // });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Express server listening on port ${port} in ${env} mode...`);
});
