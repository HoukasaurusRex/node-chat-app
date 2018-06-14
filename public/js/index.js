const socket = io();
const messageForm = document.querySelector('#message-form');
const messages = document.querySelector('#messages');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('newMessage', (message) => {
  console.log(message);
  const newMessage = document.createElement('li');

  newMessage.textContent = `${message.from}: ${message.text}`;
  messages.appendChild(newMessage);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.emit('createMessage', {
  from: 'Me',
  text: 'it\'s meee'
}, (message) => {
  console.log(message);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.querySelector('[name=message]').value;

  socket.emit('createMessage', {
    from: 'User',
    text
  }, (data) => {
    console.log(data);
  });
});
