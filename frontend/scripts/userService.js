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
