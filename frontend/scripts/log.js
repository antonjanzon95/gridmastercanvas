// // import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// // const socket = io('http://localhost:3000');
// import { socket } from '../main';

// export function initLog() {
//   const result = document.getElementById('result');
//   const user = document.getElementById('user');

//   const chatWindow = document.getElementById('chat');
//   if (sessionStorage.getItem('user')) {
//     console.log('inloggad');
//     renderLogoutButton();
//     printUser();
//     renderChat();
//   } else {
//     console.log('utloggad');
//     result.innerHTML = '';
//     user.innerHTML = 'ingen är inloggad';
//     chatWindow.innerHTML = '';
//     renderLogForm();
//   }
// }

// function renderLogForm() {
//   const logForm = document.getElementById('log-form');
//   logForm.innerHTML = '';
//   let logInput = document.createElement('input');
//   let logUserButton = document.createElement('button');

//   logInput.type = 'text';
//   logInput.placeholder = 'namn';
//   logUserButton.innerHTML = 'logga in';

//   logForm.append(logInput, logUserButton);

//   logUserButton.addEventListener('click', (e) => {
//     e.preventDefault();

//     if (logInput.value === '') {
//       return;
//     }

//     sessionStorage.setItem('user', logInput.value);

//     socket.emit('saveUser', sessionStorage.getItem('user'));

//     logInput.value = '';
//     initLog();
//   });
// }

// function renderLogoutButton() {
//   logForm.innerHTML = '';
//   let logOutButton = document.createElement('button');

//   logOutButton.innerHTML = 'logga ut';

//   logForm.appendChild(logOutButton);

//   logOutButton.addEventListener('click', () => {
//     sessionStorage.removeItem('user');
//     user.innerHTML = '';
//     result.innerHTML = '';
//     initLog();
//   });
// }

// function printUser() {
//   socket.on('saveUser', (arg) => {
//     user.innerHTML = '';
//     user.innerHTML = `du har loggat in som ${sessionStorage.getItem('user')} `;
//   });
// }

// function renderChat() {
//   let messageInput = document.createElement('input');
//   let messageButton = document.createElement('button');

//   messageInput.type = 'text';
//   messageInput.placeholder = 'meddelande';
//   messageButton.innerHTML = 'skicka';

//   chatWindow.append(messageInput, messageButton);

//   socket.off('chat');

//   messageButton.addEventListener('click', (e) => {
//     e.preventDefault();
//     socket.emit('chat', messageInput.value);
//     messageInput.value = '';
//   });

//   socket.on('chat', (arg) => {
//     let chatMessage = arg.chatMessage;

//     result.innerHTML += `<p style="color:${chatMessage.userColor};">${chatMessage.userName} skriver: ${chatMessage.userMessage}</p>`;
//   });
// }

// // initLog();
