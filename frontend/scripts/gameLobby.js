import { socket } from "../main.js";
import { createLobbyButtons } from "./buttons.js";
// import { createGridPage, createSolutionGrid } from "./canvas.js";
import { createGrid, updateCellColor } from "./paintGrid.js";

export const createGridPage = (room) => {
  const mainContainer = document.querySelector("main");
  const user = { name: "Anton", color: "blue" };
  // sessionStorage.setItem("user", JSON.stringify(user));
  // const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  mainContainer.innerHTML = "";

  socket.on("paint", (cell) => {
    updateCellColor(cell);
  });

  createGrid(room);
  const names = renderRoomUsers(room.users);
  createLobbyButtons(room.roomId);

  mainContainer.appendChild(names);
};

const renderRoomUsers = (users) => {
  const nameHeader = document.createElement("h2");
  const names = users.map((user) => " " + user.name);
  nameHeader.classList.add("lobby-names");
  nameHeader.innerHTML = names;

  return nameHeader;
};

export const startGame = () => {
  createSolutionGrid();
};

const hidePracticeGridPage = (practiceGridContainer) => {
  practiceGridContainer.innerHTML = "";
};

export const readyCheck = () => {
  sessionStorage.setItem("user", JSON.stringify({ ...user, ready: true }));
  const usertest = JSON.parse(sessionStorage.getItem("user"));

  // set to all 4 users ready later <--
  if (usertest.ready) {
    hidePracticeGridPage(gridContainer);
    startGame();
  }
};
