import { socket } from '../main';
import { renderChatHtml } from './chatcomp';

export function initLog() {
  if (sessionStorage.getItem('user')) {
    console.log('logged in');
    renderLogoutButton();
    renderChatHtml();
  } else {
    socket.off('saveUser');

    console.log('not logged in');
    const chatDiv = document.querySelector("#chat-div");
    chatDiv.innerHTML = '';
    renderLogForm();
  }
}

function renderLogForm() {
  let header = document.querySelector("header");
  let logForm = document.createElement("div");

  let logInput = document.createElement("input");
  let logUserButton = document.createElement("button");

  logInput.type = "text";
  logInput.placeholder = "name";
  logUserButton.innerHTML = "log in";

  header.appendChild(logForm);
  logForm.append(logInput, logUserButton);

  logUserButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (logInput.value === "") {
      return;
    }

    let user = {name: logInput.value, color: '', id: ''};

    sessionStorage.setItem('user', JSON.stringify(user));

    socket.emit('saveUser', JSON.parse(sessionStorage.getItem('user')));

    initLog();
    logInput.value = '';
    logForm.innerHTML = '';
  });
  
  socket.on('userLoggedIn', (data) => {
    console.log(data);
    const user = data.user;
    sessionStorage.setItem('user', JSON.stringify(user));
    
    console.log(`${user.name} has logged in with color ${user.color}`);
    const color = user.color;
    console.log(color);
    sessionStorage.setItem('color', color)
    
  });
}

function renderLogoutButton() {
  let header = document.querySelector('header');
  let logForm = document.createElement('div');
  let logOutButton = document.createElement('button');

  logOutButton.innerHTML = "log out";
  header.appendChild(logForm);
  logForm.appendChild(logOutButton);

  logOutButton.addEventListener('click', () => {
    // let user = JSON.parse(sessionStorage.getItem('user'));
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('color');

    initLog();
    logForm.innerHTML = "";
  });
}