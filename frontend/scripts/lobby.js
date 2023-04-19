import { createSolutionGrid } from "./canvas.js";
import { saveImagePost } from "./saveImg.js";
import { fetchImages, renderImages } from "./showimgs.js";

// export const startGame = () => {};

export const createPracticeGridPage = () => {
  const mainContainer = document.querySelector("main");
  const user = { name: "Anton", color: "blue" };
  sessionStorage.setItem("user", JSON.stringify(user));
  const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  mainContainer.innerHTML = "";

  let idcounter = 0;

  let practiceImageNode = [];

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid", "rounded");
  mainContainer.appendChild(gridContainer);

  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("btn-container");
  mainContainer.appendChild(buttonContainer);

  //create the grid
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add("cell");
      gridNode.style.backgroundColor = "whitesmoke";

      let cell = {
        color: "whitesmoke",
      };

      practiceImageNode.push(cell);
      let id = idcounter;

      gridNode.addEventListener("click", () => {
        if (gridNode.style.backgroundColor == "whitesmoke") {
          gridNode.style.backgroundColor = user.color;
          practiceImageNode[id].color = user.color;
        } else {
          gridNode.style.backgroundColor = "whitesmoke";
          practiceImageNode[id].color = "whitesmoke";
        }
      });
      gridContainer.appendChild(gridNode);
      idcounter++;
    }
  }

  // save practice image button
  const saveImageBtn = document.createElement("button");
  saveImageBtn.innerHTML = "Save Image";
  saveImageBtn.classList.add("btn");

  // save practice image
  saveImageBtn.addEventListener("click", () => {
    // ändra till att alla 4 users sparas med bilden <--
    const saveImage = { user: user, image: practiceImageNode };
    // localStorage.setItem("images", JSON.stringify(siaveImage));

    saveImagePost(saveImage);
  });

  // start game button
  const startBtn = document.createElement("button");
  startBtn.innerHTML = "Start Game";
  startBtn.classList.add("btn");

  // set user is done on click
  startBtn.addEventListener("click", () => {
    sessionStorage.setItem("user", JSON.stringify({ ...user, ready: true }));
    const usertest = JSON.parse(sessionStorage.getItem("user"));

    // set to all 4 users ready later <--
    if (usertest.ready) {
      hidePracticeGridPage(gridContainer);
      createSolutionGrid();
    }
  });

  // save practice image button
  const newGridBtn = document.createElement("button");
  newGridBtn.innerHTML = "New Canvas";
  newGridBtn.classList.add("btn");

  // save practice image
  newGridBtn.addEventListener("click", createPracticeGridPage);

  buttonContainer.appendChild(startBtn);
  buttonContainer.appendChild(saveImageBtn);
  buttonContainer.appendChild(newGridBtn);
};

const hidePracticeGridPage = (practiceGridContainer) => {
  practiceGridContainer.innerHTML = "";
};
