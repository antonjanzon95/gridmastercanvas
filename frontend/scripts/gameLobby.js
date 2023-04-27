import { socket } from '../main.js';
import { createLobbyButtons } from './buttons.js';
import { renderChat, renderChatHtml } from './chatcomp.js';
import { renderRoomsSection } from './gameRooms.js';
import {
  createSolutionGrid,
  createGrid,
  updateCellColor,
} from './paintGrid.js';

export const createGameLobbyPage = (room) => {
  socket.off('monitorRooms');

  const mainContainer = document.querySelector('main');

  // add roomId to user in sessionstorage
  const user = JSON.parse(sessionStorage.getItem('user'));
  user.roomId = room.roomId;
  user.currentChat = 'local';
  sessionStorage.setItem('user', JSON.stringify(user));

  socket.on('monitorRoomMessages', (roomWithMessage) => {
    renderChat(roomWithMessage.messages);
  });

  socket.on('leaveRoom', (updatedRoom) => {
    // usersInLobby = renderRoomUsers(updatedRoom.users);
    renderChat(updatedRoom.messages);
  });

  renderChatHtml();
  renderChat(room.messages);
  document.querySelector('#global-chat').disabled = false;

  mainContainer.innerHTML = '';

  socket.on('readyCheck', (userAndRoom) => {
    if (userAndRoom.room.id != room.id) {
      return;
    }
    if (userAndRoom.user.id == user.id) {
      user.ready = userAndRoom.user.ready; // lade till detta för att kunna toggla ready
      sessionStorage.setItem('user', JSON.stringify(user));
    }
    const playerReady = document.getElementById(userAndRoom.user.id);
    playerReady.innerHTML = '&#x2713;' + userAndRoom.user.name;
  });

  socket.on('paint', (roomIdAndUpdatedCell) => {
    if (roomIdAndUpdatedCell.roomId != room.roomId) {
      return;
    }
    updateCellColor(roomIdAndUpdatedCell.updatedCell);
  });

  createGrid(room);
  let usersInLobby = renderRoomUsers(room.users);
  createLobbyButtons(room.roomId);

  mainContainer.appendChild(usersInLobby);
};

export function leaveRoom() {
  socket.off('joinRoom');
  socket.off('leaveRoom');
  const user = JSON.parse(sessionStorage.getItem('user'));
  const messages = JSON.parse(sessionStorage.getItem('globalMessages'));
  let globalChatBtn = document.querySelector('#global-chat');
  let roomChatBtn = document.querySelector('#room-chat');
  globalChatBtn.disabled = true;
  roomChatBtn.disabled = true;

  socket.off('monitorRooms');
  socket.emit('leaveRoom', user);

  renderRoomsSection();
  renderChat(messages);
}

export const renderRoomUsers = (users) => {
  const usersWrapper = document.createElement('div');
  usersWrapper.classList.add('user-ready-container');
  users.forEach((user) => {
    const userContainer = createUserContainer(user);
    usersWrapper.appendChild(userContainer);
  });

  return usersWrapper;
};

function createUserContainer(user) {
  const userContainer = document.createElement('div');
  userContainer.classList.add('user-container');

  // color indicator
  const colorCircle = document.createElement('div');
  colorCircle.classList.add('color-circle');
  colorCircle.style.backgroundColor = user.color;

  // name
  const nameHeading = document.createElement('h2');
  nameHeading.id = user.id;

  if (user.ready == true) {
    nameHeading.innerHTML = '&#x2713;' + user.name;
  } else {
    nameHeading.innerHTML = user.name;
  }

  userContainer.append(colorCircle, nameHeading);

  return userContainer;
}

export const readyCheck = (e) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const roomId = e.target.id; // room id is same as btn id

  const roomAndUser = {
    room: roomId,
    user: user.id,
  };

  console.log(roomId);

  socket.on('showSolutionGrid', (room) => {
    if (room.roomId != roomId) {
      return;
    }
    createSolutionGrid(room);

    socket.off('showSolutionGrid');
  });

  socket.emit('readyCheck', roomAndUser);
};
