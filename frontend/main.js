import "./style.css";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("http://localhost:3000");

document.querySelector("#app").innerHTML = `
  <div class="h-screen bg-teal-900 parent">
    <header class="div1 w-full h-full">header</header>
      <section class="div5 w-full h-full">regler</section>
      <section class="div4 w-full h-full">sparade bilder</section>
      <main class="div3 w-full h-full p-4 flex justify-center items-center gap-4"><div class="canvas-grid rounded w-[700px] h-[700px]"></div></main>
      <aside class="div2 w-full h-full">chat</aside>
  </div>
`;

socket.emit("hej", "Hej");

socket.on("hej", (arg) => {
  console.log(arg);
});

socket.on("hejhej", (arg) => {
  console.log(arg);
});

//////////// CANVAS GRID ////////////
const mainContainer = document.querySelector("main");
const gridContainer = document.querySelector(".canvas-grid");
const user = { name: "Anton", color: "blue" };
sessionStorage.setItem("user", JSON.stringify(user));
const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

const init = () => {
  createGridPage();
};

const createGridPage = () => {
  //create the grid
  for (let i = 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add(
        "rounded",
        "border-2",
        "border-black",
        "hover:bg-gray-400"
      );
      gridNode.style.backgroundColor = "whitesmoke";
      gridNode.addEventListener("click", () => {
        if (gridNode.style.backgroundColor == "whitesmoke") {
          gridNode.style.backgroundColor = user.color;
        } else {
          gridNode.style.backgroundColor = "whitesmoke";
        }
      });
      gridContainer.appendChild(gridNode);
    }
  }

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
};

init();
