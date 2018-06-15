const http = require('http');
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');
const { Users } = require('./utils/users');

const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    const { name, room } = params;
    if (!isRealString(name) || !isRealString(room)) {
      callback('Name and room required.')
    }
    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);

    io.to(room).emit('updateUserList', users.getUserList(room));
    socket.emit('newMessage', generateMessage('Overseer', 'Welcome to the fight'));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Overseer', `${name} has joined the carnage`));
    callback();
  });

  socket.on('createMessage', (message, callback) => {
    const user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    const user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => {
    const user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Overseer', `${user.name} has fallen in battle`));
    }
  });
});

server.listen(port, () => {
  console.log(`Express server listening on port ${port} in ${env} mode...`);
});
