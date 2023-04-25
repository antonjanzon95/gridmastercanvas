import { socket } from "../main.js";
import { createLobbyButtons } from "./buttons.js";
import {
  createSolutionGrid,
  createGrid,
  updateCellColor,
} from "./paintGrid.js";

export const createGameLobbyPage = (room) => {
  const mainContainer = document.querySelector("main");

  // sessionStorage.setItem("user", JSON.stringify(user));
  // const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  mainContainer.innerHTML = "";

  socket.on("readyCheck", (userAndRoom) => {
    if (userAndRoom.room.id != room.id) {
      return;
    }
    const playerReady = document.getElementById(userAndRoom.user.id);
    playerReady.innerHTML = "&#x2713;" + userAndRoom.user.name;
  });

  socket.on("paint", (roomIdAndUpdatedCell) => {
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

export const renderRoomUsers = (users) => {
  const usersWrapper = document.createElement("div");

  users.forEach((user) => {
    const userContainer = createUserContainer(user);
    usersWrapper.appendChild(userContainer);
  });

  return usersWrapper;
};

function createUserContainer(user) {
  const userContainer = document.createElement("div");
  userContainer.classList.add("user-container");

  // color indicator
  const colorCircle = document.createElement("div");
  colorCircle.classList.add("color-circle");
  colorCircle.style.backgroundColor = user.color;

  // name
  const nameHeading = document.createElement("h2");
  nameHeading.id = user.id;

  if (user.ready == true) {
    nameHeading.innerHTML = "&#x2713;" + user.name;
  } else {
    nameHeading.innerHTML = user.name;
  }

  userContainer.append(colorCircle, nameHeading);

  return userContainer;
}

export const readyCheck = (e) => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const roomId = e.target.id; // room id is same as btn id

  const roomAndUser = {
    room: roomId,
    user: user.id,
  };

  console.log(roomId);

  socket.on("showSolutionGrid", (room) => {
    if (room.roomId != roomId) {
      return;
    }
    createSolutionGrid(room);
  });

  socket.emit("readyCheck", roomAndUser);
};
