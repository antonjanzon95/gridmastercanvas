import { socket } from '../main';

export function renderChatHtml() {

  console.log('Hej från chat!');
  const chatDiv = document.querySelector('#chat-div');
  chatDiv.innerHTML = '';

  chatDiv.innerHTML = `
  <section class="story-highlights">
      <p>Users online:</p>
        <div class="scroll-container">
        <div class="item">
            <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        
      </div>
    </section>
  <div class="chat-btn-wrapper">
    <button>GLOBAL chat</button>
    <button class="room-chat" id="roomChat">ROOM chat</button>
    <button class="material-symbols-outlined" id="light-dark-mode">
    dark_mode
    </button>
  </div>
    <div class="chat-container">
        <div class="messages" id="messages"></div>
      <input type='text' id='send-message' placeholder='Lets chat'/>
        <button id='send-button' class="send-button">Send</button>
    </div>
  `;

  let roomChatBtn = document.querySelector('#roomChat');
  let messages = document.querySelector('#messages');
  let sendButton = document.querySelector('#send-button');
  let sendMessage = document.querySelector('#send-message');
  let lightdarkBtn = document.querySelector('#light-dark-mode');
  let isDarkMode = false;
  roomChatBtn.disabled = true;

  socket.on('message', (msg) => {
    console.log(msg);
    console.log(msg.user);

    let user = JSON.parse(sessionStorage.getItem('user'));
    console.log(user);
    console.log(user.name);

    let chat = document.createElement('div');
    chat.setAttribute('class', 'message');

    if (msg.user === user.name) {
      chat.setAttribute('class', 'send-message');
    } else {
      chat.setAttribute('class', 'receive-message');
    }

    if (msg.color) {
      chat.style.backgroundColor = msg.color;
      const luminance = calculateLuminance(msg.color);
      if (luminance > 0.5) {
        chat.style.color = '#1b1b1b';
      } else {
        chat.style.color = 'whitesmoke';
      }
    }

    // if() chatten där meddelandet skrivs är aktiv
    chat.innerHTML += msg.user + ': ' + msg.message;
    const globalChat = {user: msg.user, message: msg.message, color: msg.color};
    let globalMessages = JSON.parse(sessionStorage.getItem('globalMessages'));
    globalMessages.unshift(globalChat);
    sessionStorage.setItem('globalMessages', JSON.stringify(globalMessages));
    
    messages.insertBefore(chat, messages.firstChild);
    messages.scrollTop = messages.scrollHeight;
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
    console.log('lets change light-dark-mode');
    let body = document.body;

    if (isDarkMode) {
      lightdarkBtn.innerHTML = 'dark_mode';
      body.classList.remove('dark');
    } else {
      lightdarkBtn.innerHTML = 'light_mode';
      body.classList.add('dark');
    }
    isDarkMode = !isDarkMode;
  });
}

function calculateLuminance(color) {
  console.log(color);
  const rgb = hexToRgb(color);
  //Luminance (perceived option 1): (0.299*R + 0.587*G + 0.114*B)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  console.log(luminance);

  return luminance;
}

function hexToRgb(hex) {
  console.log(hex);
  hex = hex.replace('#', '');
  console.log(hex);

  //convert hex to integer,
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  console.log({ r, g, b });

  return { r, g, b };
}

function sendChat() {
  const messageInput = document.querySelector("#send-message");
  let user = JSON.parse(sessionStorage.getItem('user'));
  // let user = sessionStorage.getItem("user");
  // let color = sessionStorage.getItem("color");

  socket.emit('message', {
    message: messageInput.value,
    user: user.name,
    color: user.color,
  });
  messageInput.value = '';
}

export function renderChat(currentChat) {
  const chatWindow = document.querySelector("#messages");
  const user = JSON.parse(sessionStorage.getItem("user"));
  let messages;
  if (currentChat == "global") {
    messages = JSON.parse(sessionStorage.getItem("globalMessages"));

    // messages.reverse();

    messages.forEach((message) => {
      let chat = document.createElement('div');
      chat.setAttribute('class', 'message');
      chat.innerHTML = message.user + ": " + message.message;
      // chatWindow.insertBefore(chat, chatWindow.firstChild);

      if (message.user === user.name) {
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
}