import { socket } from '../main';

export function renderChatHtml() {
  const chatDiv = document.querySelector('#chat-div');
  chatDiv.innerHTML = '';

  chatDiv.innerHTML = `
  <section class="story-highlights">
      <p id="users-online"></p>
        <div class="scroll-container" id="scroll-container">

        
      </div>
    </section>
  <div class="chat-btn-wrapper">
    <button class="global-chat active-chat-btn" id="global-chat">GLOBAL chat</button>
    <button class="room-chat" id="room-chat">ROOM chat</button>
    <button class="material-symbols-outlined light" id="light-dark-mode">
    light_mode
    </button>
  </div>
    <div class="chat-container">
        <div class="messages" id="messages"></div>
      <input type='text' id='send-message' placeholder='Lets chat'/>
        <button id='send-button' class="send-button button">Send</button>
    </div>
  `;

  let globalChatBtn = document.querySelector('#global-chat');
  let roomChatBtn = document.querySelector('#room-chat');
  let sendButton = document.querySelector('.send-button');
  let sendMessage = document.querySelector('#send-message');
  let lightdarkBtn = document.querySelector('#light-dark-mode');
  let isDarkMode = false;
  roomChatBtn.disabled = true;
  globalChatBtn.disabled = true;

  globalChatBtn.addEventListener('click', () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    user.currentChat = 'global';
    sessionStorage.setItem('user', JSON.stringify(user));
    roomChatBtn.classList.remove('showChat');
    globalChatBtn.classList.add('showChat');
    roomChatBtn.disabled = false;
    globalChatBtn.disabled = true;
    renderChat(JSON.parse(sessionStorage.getItem('globalMessages')));
  });

  roomChatBtn.addEventListener('click', async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userRoomId = user.roomId;
    user.currentChat = 'local';
    sessionStorage.setItem('user', JSON.stringify(user));
    roomChatBtn.classList.add('showChat');
    globalChatBtn.classList.remove('showChat');
    globalChatBtn.disabled = false;
    roomChatBtn.disabled = true;
    const roomMessages = await fetchRoomMessages(userRoomId);
    renderChat(roomMessages);
  });

  sendMessage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault();
      sendChat();
    }
  });

  sendButton.addEventListener('click', () => {
    console.log('Klick på knapp');
    sendChat();
  });

  lightdarkBtn.addEventListener('click', () => {
    let body = document.body;

    if (isDarkMode) {
      lightdarkBtn.innerHTML = 'light_mode';
      body.classList.remove('light');
    } else {
      lightdarkBtn.innerHTML = 'dark_mode';
      body.classList.add('light');
    }
    isDarkMode = !isDarkMode;
  });
}

async function fetchRoomMessages(roomId) {
  const response = await fetch(
    'http://localhost:3000/rooms/messages/' + roomId
  );
  const data = await response.json();

  return data;
}

function calculateLuminance(color) {
  const rgb = hexToRgb(color);
  //Luminance (perceived option 1): (0.299*R + 0.587*G + 0.114*B)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance;
}

function hexToRgb(hex) {
  hex = hex.replace('#', '');

  //convert hex to integer,
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function sendChat() {
  const messageInput = document.querySelector('#send-message');
  let user = JSON.parse(sessionStorage.getItem('user'));

  const messageToGlobal = {
    message: messageInput.value,
    user: user,
    color: user.color,
  };

  const messageToLocal = {
    message: messageInput.value,
    user: user,
  };

  if (user.currentChat == 'global') {
    socket.emit('globalMessage', messageToGlobal);
    messageInput.value = '';
  } else if (user.currentChat == 'local') {
    socket.emit('localMessage', messageToLocal);
    messageInput.value = '';
  } else {
    return;
  }
}

export function renderChat(messages) {
  let globalChatBtn = document.querySelector('#global-chat');
  let roomChatBtn = document.querySelector('#room-chat');
  const chatWindow = document.querySelector('#messages');
  chatWindow.innerHTML = '';
  const user = JSON.parse(sessionStorage.getItem('user'));

  if (user.currentChat == 'global') {
    globalChatBtn.classList.add('active-chat-btn');
    roomChatBtn.classList.remove('active-chat-btn');
  } else if (user.currentChat == 'local') {
    roomChatBtn.classList.add('active-chat-btn');
    globalChatBtn.classList.remove('active-chat-btn');
  }

  if (messages == undefined) {
    return console.log('undefineeeed');
  }

  messages.forEach((message) => {
    let chat = document.createElement('div');
    chat.setAttribute('class', 'message');
    chat.innerHTML = message.user.name + ': ' + message.message;

    if (message.user.id === user.id) {
      chat.setAttribute('class', 'send-message');
    } else {
      chat.setAttribute('class', 'receive-message');
    }

    if (message.color) {
      chat.style.backgroundColor = message.color;
      const luminance = calculateLuminance(message.color);
      if (luminance > 0.5) {
        chat.style.color = '#1b1b1b';
      } else {
        chat.style.color = 'whitesmoke';
      }
    }

    chatWindow.appendChild(chat);
  });
}
