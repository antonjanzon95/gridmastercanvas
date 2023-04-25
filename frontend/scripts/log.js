import { socket } from '../main';
import { renderChatHtml } from './chatcomp';
import { renderRoomsSection } from './gameRooms';

export function initLog() {
  renderLogo();
  if (sessionStorage.getItem('user')) {
    console.log('logged in');
    renderChatHtml();
    renderRoomsSection();
    renderSiteNav();
    renderLogoutButton();
  } else {
    socket.off('saveUser');
    console.log('not logged in');
    renderWelcome();
    renderLogForm();
  }
}

function renderWelcome() {
  let div = document.createElement('div');
  let header = document.querySelector('header');

  div.innerHTML =
    'Välkommen till gridmaster Canvas, logga in för att börja måla';

  header.append(div);
}

function renderLogForm() {
  let header = document.querySelector('header');
  let logForm = document.createElement('div');
  let logInput = document.createElement('input');
  let logUserButton = document.createElement('button');

  logInput.type = 'text';
  logInput.placeholder = 'name';
  logUserButton.innerHTML = 'log in';

  header.appendChild(logForm);
  logForm.append(logInput, logUserButton);

  logUserButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (logInput.value === '') {
      return;
    }

    let user = { name: logInput.value, color: '', id: '' };

    sessionStorage.setItem('user', JSON.stringify(user));

    socket.emit('saveUser', JSON.parse(sessionStorage.getItem('user')));

    header.innerHTML = '';
    logInput.value = '';
    logForm.innerHTML = '';
    initLog();
  });

  socket.on('userLoggedIn', (data) => {
    console.log(data);
    const user = data.user;
    sessionStorage.setItem('user', JSON.stringify(user));

    console.log(`${user.name} has logged in with color ${user.color}`);
    const color = user.color;
    console.log(color);
    sessionStorage.setItem('color', color);
  });
}

function renderLogo() {
  let header = document.querySelector('#header');
  let div = document.createElement('div');
  let logo = document.createElement('img');

  logo.setAttribute('src', '/gridmastercanvas_logo.png');
  logo.setAttribute('alt', 'Grid Master Canvas Logo');
  logo.setAttribute('width', '400');

  header.appendChild(div);
  div.appendChild(logo);
}

function renderSiteNav() {
  let header = document.querySelector('header');
  let navContainer = document.createElement('div');

  navContainer.classList.add('navContainer');

  let navImg = document.createElement('button');
  let navPlay = document.createElement('button');
  let navScore = document.createElement('button');

  navImg.innerHTML = 'Saved images';
  navPlay.innerHTML = 'How to play';
  navScore.innerHTML = 'Highscores';

  header.appendChild(navContainer);
  navContainer.append(navImg, navPlay, navScore);

  navImg.addEventListener('click', () => {
    console.log('clicked img');
  });

  navPlay.addEventListener('click', () => {
    console.log('clicked how to play');
  });

  navScore.addEventListener('click', () => {
    console.log('clicked highscore');
  });
}

function renderLogoutButton() {
  let chatDiv = document.querySelector('#chat-div');
  let mainContainer = document.querySelector('main');
  let header = document.querySelector('header');
  let logForm = document.createElement('div');
  let logOutButton = document.createElement('button');

  logOutButton.innerHTML = 'log out';
  header.appendChild(logForm);
  logForm.appendChild(logOutButton);

  logOutButton.addEventListener('click', () => {
    // let user = JSON.parse(sessionStorage.getItem('user'));
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('color');

    mainContainer.innerHTML = '';

    chatDiv.innerHTML = '';
    header.innerHTML = '';
    initLog();
  });
}
