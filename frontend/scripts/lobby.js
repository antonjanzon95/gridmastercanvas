import { createSolutionGrid, createGridPage } from "./canvas.js";

export const startGame = () => {};

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
  buttonContainer.classList.add(
    "flex",
    "flex-col",
    "justify-center",
    "items-center",
    "gap-2"
  );
  mainContainer.appendChild(buttonContainer);

  //create the grid
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
  saveImageBtn.classList.add(
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

  // save practice image
  saveImageBtn.addEventListener("click", () => {
    // ändra till att alla 4 users sparas med bilden <--
    const saveImage = { user: user, image: practiceImageNode };
    localStorage.setItem("images", JSON.stringify(saveImage));
  });

  // view images button
  const viewImageBtn = document.createElement("button");
  viewImageBtn.innerHTML = "View Images";
  viewImageBtn.classList.add(
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

  // view saved images
  const viewSavedImages = () => {
    const savedImages = JSON.parse(localStorage.getItem("images"));
    console.log(savedImages);
  };

  // view saved images
  viewImageBtn.addEventListener("click", viewSavedImages);

  // start game button
  const startBtn = document.createElement("button");
  startBtn.innerHTML = "Start Game";
  startBtn.classList.add(
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
  startBtn.addEventListener("click", () => {
    sessionStorage.setItem("user", JSON.stringify({ ...user, ready: true }));
    const usertest = JSON.parse(sessionStorage.getItem("user"));

    // set to all 4 users ready later <--
    if (usertest.ready) {
      hidePracticeGridPage();
      createSolutionGrid();
    }
  });

  // save practice image button
  const newGridBtn = document.createElement("button");
  newGridBtn.innerHTML = "New Canvas";
  newGridBtn.classList.add(
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

  // save practice image
  newGridBtn.addEventListener("click", createPracticeGridPage);

  buttonContainer.appendChild(startBtn);
  buttonContainer.appendChild(viewImageBtn);
  buttonContainer.appendChild(saveImageBtn);
  buttonContainer.appendChild(newGridBtn);
};
