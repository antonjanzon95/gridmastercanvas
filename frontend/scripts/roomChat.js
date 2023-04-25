import { socket } from '../main';
import { renderChatHtml, renderChat } from './chatcomp';

export function renderRoomChat() {
  const chatDiv = document.querySelector('.chat-div');
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
    <p>ROOM chat</p>
  <div class="chat-btn-wrapper">
    <button class="global-chat" id="global-chat">GLOBAL chat</button>
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

  let globalChatBtn = document.querySelector('#global-chat');
  let roomChatBtn = document.querySelector('#roomChat');
  let messages = document.querySelector('#messages');
  let sendButton = document.querySelector('#send-button');
  let sendMessage = document.querySelector('#send-message');
  let lightdarkBtn = document.querySelector('#light-dark-mode');
  let isDarkMode = false;
  roomChatBtn.disabled = true;

  // socket.on('roomMessage', (msg) => {
  //   console.log(msg);
  //   console.log(msg.user);

  //   let user = JSON.parse(sessionStorage.getItem('user'));
  //   console.log(user);
  //   console.log(user.name);

  //   let chat = document.createElement('div');
  //   chat.setAttribute('class', 'message');

  //   if (msg.user === user.name) {
  //     chat.setAttribute('class', 'send-message');
  //   } else {
  //     chat.setAttribute('class', 'receive-message');
  //   }

  //   if (msg.color) {
  //     chat.style.backgroundColor = msg.color;
  //     const luminance = calculateLuminance(msg.color);
  //     if (luminance > 0.5) {
  //       chat.style.color = '#1b1b1b';
  //     } else {
  //       chat.style.color = 'whitesmoke';
  //     }
  //   }

  //   chat.innerHTML = msg.user + ': ' + msg.message;
  //   messages.insertBefore(chat, messages.firstChild);
  //   messages.scrollTop = messages.scrollHeight;
  // });

  globalChatBtn.addEventListener('click', () => {
    console.log('click globalChat');
    
    printChatHistory();
    renderChatHtml();
    renderChat("global");
  })

}

function printChatHistory() {
  let chatHistory = JSON.parse(sessionStorage.getItem('globalMessages'));
  console.log(chatHistory);
  
}
