export async function fetchUsers() {
  const response = await fetch('http://localhost:3000/users');
  const users = await response.json();
  console.log('users', users);
  return users;
}

export function renderUserCount(userCount) {
  const usersOnlineElement = document.querySelector('#users-online');

  usersOnlineElement.innerHTML = 'Users online: ' + userCount;
}

export function renderUsers(globalUsers) {
  console.log(globalUsers);
  const users = globalUsers;
  const scrollContainer = document.querySelector('#scroll-container');
  scrollContainer.innerHTML = '';

  users.forEach(user => {
    const item = document.createElement('div');
    item.classList.add('item');

    const colorCircle = document.createElement('div');
    colorCircle.classList.add('user-color-circle');
    colorCircle.style.backgroundColor = user.color;

    const name = document.createElement('p');
    name.textContent = user.name;

    item.appendChild(colorCircle);
    item.appendChild(name);

    scrollContainer.appendChild(item);
  })
}