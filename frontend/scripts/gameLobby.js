import { socket } from "../main.js";
import { createLobbyButtons } from "./buttons.js";
import {
  createSolutionGrid,
  createGrid,
  updateCellColor,
} from "./paintGrid.js";

export const createGameLobbyPage = (room) => {
  const mainContainer = document.querySelector("main");
  const user = { name: "Anton", color: "blue" };
  // sessionStorage.setItem("user", JSON.stringify(user));
  // const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  mainContainer.innerHTML = "";

  socket.on("readyCheck", (user) => {
    const playerReady = document.getElementById(socket.id);
    playerReady.innerHTML = "&#x2713;" + user.name;
  });

  socket.on("paint", (cell) => {
    updateCellColor(cell);
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
  const colorCircle = document.createElement("div");
  colorCircle.classList.add("color-circle");
  colorCircle.style.backgroundColor = user.color;
  const nameHeading = document.createElement("h2");
  nameHeading.id = socket.id;
  // if (user.ready) {
  //   nameHeading.innerHTML = "&#x2713;" + user.name;
  // } else {
  //
  // }
  nameHeading.innerHTML = user.name;
  userContainer.append(colorCircle, nameHeading);
  return userContainer;
}

// export const startGame = () => {
//   createSolutionGrid();
// };

const hidePracticeGridPage = (practiceGridContainer) => {
  practiceGridContainer.innerHTML = "";
};

export const readyCheck = (e) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const roomId = e.target.id; // room id is same as btn id

  const roomAndUser = {
    room: roomId,
    user: user,
  };

  socket.on("showSolutionGrid", (room) => {
    createSolutionGrid(room);
  });

  socket.emit("readyCheck", roomAndUser);
};
