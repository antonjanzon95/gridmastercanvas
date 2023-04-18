import "./style.css";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("http://localhost:3000");

document.querySelector("#app").innerHTML = `
  <div class="h-screen bg-teal-900 parent">
    <header class="div1 w-full h-full">header</header>
      <section class="div5 w-full h-full">regler</section>
      <section class="div4 w-full h-full">sparade bilder</section>
      <main class="div3 w-full h-full">spelet/lobbys</main>
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
