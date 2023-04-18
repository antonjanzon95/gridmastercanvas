import { grids } from "../main";
import { showGameOverPage } from "./gameover";

export const createGridPage = () => {
  const mainContainer = document.querySelector("main");
  const user = { name: "Anton", color: "blue" };
  sessionStorage.setItem("user", JSON.stringify(user));
  const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  mainContainer.innerHTML = "";

  let idcounter = 0;

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid");
  mainContainer.appendChild(gridContainer);

  let gameTry = [];

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add("cell");
      gridNode.style.backgroundColor = "whitesmoke";

      let cell = {
        color: "whitesmoke",
      };

      gameTry.push(cell);
      let id = idcounter;

      gridNode.addEventListener("click", (e) => {
        if (gridNode.style.backgroundColor == "whitesmoke") {
          gridNode.style.backgroundColor = user.color;
          gameTry[id].color = user.color;
        } else {
          gridNode.style.backgroundColor = "whitesmoke";
          gameTry[id].color = "whitesmoke";
        }
      });
      gridContainer.appendChild(gridNode);
      idcounter++;
    }
  }

  // done button
  const doneBtn = document.createElement("button");
  doneBtn.innerHTML = "Done";
  doneBtn.classList.add("btn");

  // set user is done on click
  doneBtn.addEventListener("click", () => {
    sessionStorage.setItem("user", JSON.stringify({ ...user, done: true }));
    const usertest = JSON.parse(sessionStorage.getItem("user"));

    if (usertest.done) {
      let finalScore = compareTryToSolution(grids.try, grids.solution);
      showGameOverPage(finalScore);
    } else {
      return alert("inte klar");
    }
  });

  mainContainer.appendChild(doneBtn);

  grids.try = gameTry;
};

export function createSolutionGrid() {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid");
  mainContainer.appendChild(gridContainer);

  let facit = [];

  let colors = ["green", "blue", "red", "yellow", "whitesmoke"];

  let idcounter = 1;

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

// calculate score
export function compareTryToSolution(gameTry, solution) {
  let correctChoice = 0;

  for (let i = 0; i < solution.length; i++) {
    if (gameTry[i].color === solution[i].color) {
      correctChoice++;
    }
  }

  let correctAmountInPercentage = (correctChoice / solution.length) * 100;

  return correctAmountInPercentage;
}
