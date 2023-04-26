export async function fetchUsers() {
  const response = await fetch('http://localhost:3000/users');
  const users = await response.json();
  console.log('users', users);
  return users;
}