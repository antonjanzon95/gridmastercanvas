import { grids } from "../main";

export const createGridPage = () => {
  const mainContainer = document.querySelector("main");
  const user = { name: "Anton", color: "blue" };
  sessionStorage.setItem("user", JSON.stringify(user));
  const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  mainContainer.innerHTML = "";

  let idcounter = 0;

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid", "rounded");
  mainContainer.appendChild(gridContainer);

  let gameTry = [];

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add(
        "rounded",
        "border-2",
        "border-black",
        "hover:bg-gray-400"
      );
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

  console.log(gameTry);

  // done button
  const doneBtn = document.createElement("button");
  doneBtn.innerHTML = "Done";
  doneBtn.classList.add(
    "px-4",
    "py-2",
    "bg-gradient-to-r",
    "from-orange-500",
    "to-orange-800",
    "rounded-lg",
    "text-xl",
    "font-bold",
    "shadow-xl"
  );

  // set user is done on click
  doneBtn.addEventListener("click", () => {
    sessionStorage.setItem("user", JSON.stringify({ ...user, done: true }));
    const usertest = JSON.parse(sessionStorage.getItem("user"));
    console.log(usertest);
  });

  mainContainer.appendChild(doneBtn);

  grids.try = gameTry;
};

export function createSolutionGrid() {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";

  const gridContainer = document.createElement("div");
  gridContainer.classList.add(
    "canvas-grid",
    "rounded",
    "w-[700px]",
    "h-[700px]"
  );
  mainContainer.appendChild(gridContainer);

  let facit = [];

  let colors = ["green", "blue", "red", "yellow", "whitesmoke"];

  let idcounter = 1;

  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add(
        "rounded",
        "border-2",
        "border-black",
        "hover:bg-gray-400"
      );
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

  console.log(facit);

  grids.solution = facit;
}

// button event to calculate score
export function handleCompareClick() {
  let score = compareTryToSolution(grids.try, grids.solution);
  console.log("score:", score + "%");
}

// calculate score
export function compareTryToSolution(gameTry, solution) {
  console.log("gameTry", gameTry);
  console.log("solution", solution);

  let correctChoice = 0;

  for (let i = 0; i < solution.length; i++) {
    if (gameTry[i].color === solution[i].color) {
      correctChoice++;
    }
  }

  let correctAmountInPercentage = (correctChoice / solution.length) * 100;

  return correctAmountInPercentage;
}
