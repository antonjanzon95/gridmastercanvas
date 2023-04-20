import { socket } from '../main';

export function initLog() {
  if (sessionStorage.getItem('user')) {
    console.log('logged in');
    renderLogoutButton();
  } else {
    console.log('not logged in');
    renderLogForm();
  }
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

    sessionStorage.setItem('user', logInput.value);
    socket.emit('saveUser', sessionStorage.getItem('user'));

    socket.on('saveUser', (arg) => {
      let user = arg.user;

      console.log(`${user.userName} has logged in`);

      initLog();
      logInput.value = '';
      logForm.innerHTML = '';
    });
  });
}

function renderLogoutButton() {
  let header = document.querySelector('header');
  let logForm = document.createElement('div');
  let logOutButton = document.createElement('button');

  logOutButton.innerHTML = 'log out';
  header.appendChild(logForm);
  logForm.appendChild(logOutButton);

  logOutButton.addEventListener('click', () => {
    sessionStorage.removeItem('user');
    logForm.innerHTML = '';

    initLog();
  });
}
