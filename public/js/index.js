const socket = io();

socket.on('connect', () => {
  console.log('Connected to server');

  // socket.emit('newEmail', {
  //   to: 'jt@example.com',
  //   body: 'Hey man'
  // });
  socket.emit('newMessage', {
    to: 'JT',
    body: 'Hey man'
  });
});

socket.on('newMessage', (message) => {
  console.log(message);
})

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

// socket.on('newEmail', (email) => {
//   console.log('New Email', email);
// })
