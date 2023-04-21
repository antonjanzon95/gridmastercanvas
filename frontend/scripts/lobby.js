import { socket } from "../main.js";
// import { createGridPage, createSolutionGrid } from "./canvas.js";
import { saveImagePost } from "./saveImg.js";
import { fetchImages, renderImages } from "./showimgs.js";

// export const createPracticeGridPage = () => {
//   // const user = { name: "Anton", color: "blue" };
//   sessionStorage.setItem("user", JSON.stringify(user));
//   // const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

//   socket.emit("roomJoin", user);

//   mainContainer.innerHTML = "";

//   socket.on("roomJoin", (roomIsFull) => {
//     if (roomIsFull) {
//       mainContainer.innerHTML = "Du får inte va med :(";
//       return;
//     }
//   });

//   socket.on("createGrid", (gameGrid) => {
//     const gridContainer = document.createElement("div");
//     gridContainer.classList.add("canvas-grid", "rounded");
//     mainContainer.appendChild(gridContainer);

//     let idcounter = 0;

//     //create the grid
//     for (let i = 0; i < 15; i++) {
//       for (let j = 0; j < 15; j++) {
//         const gridNode = document.createElement("div");
//         gridNode.classList.add("cell");
//         gridNode.id = idcounter;
//         gridNode.style.backgroundColor = gameGrid[idcounter].color;

//         gridNode.addEventListener("click", (e) => {
//           socket.emit("paintEvent", {
//             cell: e.target.id,
//             user: user,
//           });
//         });
//         gridContainer.appendChild(gridNode);
//         idcounter++;
//       }
//     }

//     const mainContainer = document.querySelector("main");
//     const buttonContainer = document.createElement("div");
//     buttonContainer.classList.add("btn-container");
//     mainContainer.appendChild(buttonContainer);

//     // save practice image button
//     const saveImageBtn = createButton("Save Image");
//     saveImageBtn.addEventListener("click", saveImage);

//     // start game button
//     const startBtn = createButton("Start Game");
//     startBtn.addEventListener("click", readyCheck);

//     // save practice image button
//     const newGridBtn = createButton("New Canvas");
//     newGridBtn.addEventListener("click", createPracticeGridPage);

//     buttonContainer.append(startBtn, saveImageBtn, newGridBtn);
//   });
// };

export const startGame = () => {
  createSolutionGrid();
};

const hidePracticeGridPage = (practiceGridContainer) => {
  practiceGridContainer.innerHTML = "";
};

export const createButton = (text) => {
  const button = document.createElement("button");
  button.innerHTML = text;
  button.classList.add("btn");

  return button;
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
