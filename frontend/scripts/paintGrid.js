import { socket } from "../main";
import { createGameLobbyPage } from "./gameLobby";
import { createGamePage } from "./startGame";

// import { showGameOverPage } from "./gameover";

export function updateCellColor(cell) {
  const cellElement = document.getElementById(cell.id);
  cellElement.style.backgroundColor = cell.color;
}

export const createGrid = (room) => {
  const mainContainer = document.querySelector("main");
  const gridContainer = document.createElement("div");

  mainContainer.innerHTML = "";

  gridContainer.classList.add("canvas-grid");
  mainContainer.appendChild(gridContainer);
  let myColor;
  if (!room.isStarted) {
    myColor = room.users.find((user) => user.id == socket.id).lobbyColor;
  } else {
    myColor = room.users.find((user) => user.id == socket.id).gameColor;
  }

  let idcounter = 0;
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add("cell");
      gridNode.id = idcounter;
      gridNode.style.backgroundColor = room.grid[idcounter].color;

      gridNode.addEventListener("click", (e) => {
        socket.emit("paint", {
          roomId: room.roomId,
          cellId: e.target.id,
          color: myColor,
        });
      });
      gridContainer.appendChild(gridNode);
      idcounter++;
    }
  }
};

export function createSolutionGrid(room) {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid");
  mainContainer.appendChild(gridContainer);

  socket.on("startGame", (roomToStart) => {
    if (room.roomId != roomToStart.roomId) {
      return;
    }
    socket.off("readyCheck");
    socket.off("startGame");
    createGamePage(roomToStart);
  });

  let idcounter = 0;

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add("cell");
      gridNode.style.backgroundColor = room.solutionGrid[idcounter].color;
      gridContainer.appendChild(gridNode);
      idcounter++;
    }
  }

  const countdownDiv = document.createElement("div");
  countdownDiv.classList.add("countdown");
  document.querySelector("#app").appendChild(countdownDiv);

  // timer for showing solution grid
  let cd = 5;
  const countdownInterval = setInterval(() => {
    countdownDiv.innerHTML = cd.toString();
    cd--;

    if (cd < 0) {
      countdownDiv.innerHTML = "PAINT!";
      setTimeout(() => {
        countdownDiv.innerHTML = "";
      }, 2000);
      socket.emit("startGame", room); // sköt i back-end istället
      clearInterval(countdownInterval);
    }
  }, 1000);
}
