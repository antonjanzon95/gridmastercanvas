import "./style.css";
import {
  createGridPage,
  createSolutionGrid,
  handleCompareClick,
} from "./scripts/canvas.js";
import { createPracticeGridPage } from "./scripts/lobby.js";

import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

export let grids = {};

const socket = io("http://localhost:3000");

document.querySelector("#app").innerHTML = `
  <div class="h-screen bg-teal-900 parent">
    <header class="div1 w-full h-full">header</header>
      <section class="div5 w-full h-full">regler</section>
      <section class="div4 w-full h-full">sparade bilder</section>
      <main class="div3 w-full h-full p-4 flex justify-center items-center gap-4"></main>
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

const init = () => {
  createPracticeGridPage();
};

init();
