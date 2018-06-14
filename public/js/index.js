const socket = io();
const messageForm = document.querySelector('#message-form');
const messages = document.querySelector('#messages');
const locationButton = document.querySelector('#send-location');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('newMessage', (message) => {
  console.log(message);
  const newMessage = document.createElement('li');

  newMessage.textContent = `${message.from}: ${message.text}`;
  messages.appendChild(newMessage);
});

socket.on('newLocationMessage', (message) => {
  const newMessage = document.createElement('li');
  const anchor = document.createElement('a');

  newMessage.textContent = `${message.from}: `;
  anchor.textContent = 'sharing my location...';
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('href', message.url);
  newMessage.appendChild(anchor);

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

locationButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, (err) => {
    alert('Geolocation requires permission to function')
  });
});
