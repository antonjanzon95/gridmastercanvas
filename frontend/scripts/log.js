// import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
// const socket = io('http://localhost:3000');
import { socket } from '../main';

export function initLog() {
  if (sessionStorage.getItem('user')) {
    console.log('inloggad');
    renderLogoutButton();
  } else {
    console.log('utloggad');

    renderLogForm();
  }
}

function renderLogForm() {
  let header = document.querySelector('header');
  let logForm = document.createElement('div');

  let logInput = document.createElement('input');
  let logUserButton = document.createElement('button');

  logInput.type = 'text';
  logInput.placeholder = 'namn';
  logUserButton.innerHTML = 'logga in';

  header.appendChild(logForm);
  logForm.append(logInput, logUserButton);

  logUserButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (logInput.value === '') {
      return;
    }

    sessionStorage.setItem('user', logInput.value);

    socket.emit('saveUser', sessionStorage.getItem('user'));

    logInput.value = '';
    logForm.innerHTML = '';
    initLog();
  });
}

function renderLogoutButton() {
  let header = document.querySelector('header');
  let logForm = document.createElement('div');

  let logOutButton = document.createElement('button');

  logOutButton.innerHTML = 'logga ut';
  header.appendChild(logForm);
  logForm.appendChild(logOutButton);

  logOutButton.addEventListener('click', () => {
    sessionStorage.removeItem('user');
    logForm.innerHTML = '';

    initLog();
  });
}
