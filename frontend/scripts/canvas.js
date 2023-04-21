import { grids, socket } from "../main";
import { showGameOverPage } from "./gameover";
import { createButton, readyCheck } from "./lobby";
import { saveImagePost } from "./saveImg";

export const createGridPage = (room) => {
  const mainContainer = document.querySelector("main");
  const user = { name: "Anton", color: "blue" };
  const myColor = room.users.find((user) => user.id == socket.id).color;
  // sessionStorage.setItem("user", JSON.stringify(user));
  // const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  socket.on("paint", (cell) => {
    updateCellColor(cell);
  });

  const usersInRoom = room.users;

  mainContainer.innerHTML = "";

  let idcounter = 0;

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid");
  mainContainer.appendChild(gridContainer);

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

  createButtons(room.roomId);
};

const createButtons = (roomId) => {
  const mainContainer = document.querySelector("main");
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("btn-container");
  mainContainer.appendChild(buttonContainer);

  // save practice image button
  const saveImageBtn = createButton("Save Image");
  saveImageBtn.id = roomId;
  saveImageBtn.addEventListener("click", mellanFunktion);

  // start game button
  const startBtn = createButton("Start Game");
  startBtn.addEventListener("click", readyCheck);

  // save practice image button
  const newGridBtn = createButton("New Canvas");
  // newGridBtn.addEventListener("click", createPracticeGridPage);

  buttonContainer.append(startBtn, saveImageBtn, newGridBtn);
};

function mellanFunktion(e) {
  const roomId = e.target.id;
  saveImagePost(roomId);
}

function updateCellColor(cell) {
  const cellElement = document.getElementById(cell.id);
  cellElement.style.backgroundColor = cell.color;
}

// export function createSolutionGrid() {
//   const mainContainer = document.querySelector("main");
//   mainContainer.innerHTML = "";

//   const gridContainer = document.createElement("div");
//   gridContainer.classList.add("canvas-grid");
//   mainContainer.appendChild(gridContainer);

//   let facit = [];

//   let colors = ["green", "blue", "red", "yellow", "whitesmoke"];

//   let idcounter = 1;

//   for (let i = 0; i < 15; i++) {
//     for (let j = 0; j < 15; j++) {
//       const gridNode = document.createElement("div");
//       gridNode.classList.add("cell");
//       gridNode.style.backgroundColor =
//         colors[Math.floor(Math.random() * colors.length)];

//       gridContainer.appendChild(gridNode);
//       idcounter++;

//       let cell = {
//         color: gridNode.style.backgroundColor,
//       };

//       facit.push(cell);
//     }
//   }

//   grids.solution = facit;

//   const countdownDiv = document.createElement("div");
//   countdownDiv.classList.add("countdown");
//   document.querySelector("#app").appendChild(countdownDiv);

//   let cd = 5;
//   const countdownInterval = setInterval(() => {
//     countdownDiv.innerHTML = cd.toString();
//     cd--;

//     if (cd < 0) {
//       countdownDiv.innerHTML = "MÅLA!";
//       setTimeout(() => {
//         countdownDiv.innerHTML = "";
//       }, 2000);
//       startGame(countdownInterval);
//     }
//   }, 1000);
// }

const startGame = (countdownInterval) => {
  createGridPage();
  clearInterval(countdownInterval);
};
