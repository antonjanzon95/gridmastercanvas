import { socket } from "../main";
// import { showGameOverPage } from "./gameover";

export function updateCellColor(cell) {
  const cellElement = document.getElementById(cell.id);
  cellElement.style.backgroundColor = cell.color;
}

export const createGrid = (room) => {
  const mainContainer = document.querySelector("main");
  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid");
  mainContainer.appendChild(gridContainer);
  const myColor = room.users.find((user) => user.id == socket.id).color;

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

export function createFacitGrid() {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid");
  mainContainer.appendChild(gridContainer);

  let idcounter = 0;

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add("cell");
      gridNode.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];

      gridContainer.appendChild(gridNode);
      idcounter++;

      let cell = {
        color: gridNode.style.backgroundColor,
      };

      facit.push(cell);
    }
  }

  grids.solution = facit;

  const countdownDiv = document.createElement("div");
  countdownDiv.classList.add("countdown");
  document.querySelector("#app").appendChild(countdownDiv);

  let cd = 5;
  const countdownInterval = setInterval(() => {
    countdownDiv.innerHTML = cd.toString();
    cd--;

    if (cd < 0) {
      countdownDiv.innerHTML = "MÅLA!";
      setTimeout(() => {
        countdownDiv.innerHTML = "";
      }, 2000);
      startGame(countdownInterval);
    }
  }, 1000);
}

const startGame = (countdownInterval) => {
  createGridPage();
  clearInterval(countdownInterval);
};
