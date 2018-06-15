const socket = io();
const messageForm = document.querySelector('#message-form');
const locationButton = document.querySelector('#send-location');

function scrollToBottom() {
  const messages = document.querySelector('#messages');
  const newMessage = messages.querySelector('li:last-child');
  const newMessageHeight = newMessage.offsetHeight;
  const { clientHeight, scrollTop, scrollHeight } = messages;
  if (clientHeight + scrollTop + newMessageHeight >= scrollHeight) {
    messages.scrollTop = scrollHeight;
  }
}

socket.on('connect', () => {
  const search = window.location.search.substring(1);
  const params =
    JSON.parse(
      '{"' + search.replace(/&/g, '","').replace(/=/g,'":"').replace(/\+/g, '%20') + '"}',
      function(key, value) {
        return key === ""?value:decodeURIComponent(value)
      });
  console.log(params);
  socket.emit('join', params, (err) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('success!');
    }
  });
});

socket.on('updateUserList', (users) => {
  const usersContainer = document.querySelector('#users');
  const usersList = document.createElement('ol');
  users.forEach((user) => {
    const userItem = document.createElement('li');
    userItem.textContent = user;
    usersList.appendChild(userItem);

  });
  usersContainer.textContent = '';
  usersContainer.appendChild(usersList);
});

socket.on('newMessage', (message) => {
  const messages = document.querySelector('#messages');
  const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime,
  });

  messages.innerHTML += html;
  scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
  const messages = document.querySelector('#messages');
  const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#location-message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime,
  });

  messages.innerHTML += html;
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.emit('createMessage', {
  from: 'User',
  text: 'Witness me!'
}, () => {

});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let text = document.querySelector('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: text.value
  }, () => {
    text.value = '';
  });
});

locationButton.addEventListener('click', (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }
  locationButton.setAttribute('disabled', 'disabled');
  locationButton.textContent = 'Sending...';

  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send Location';
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, (err) => {
    locationButton.removeAttribute('disabled');
    locationButton.textContent = 'Send Location';
    alert('Geolocation requires permission to function')
  });
});
