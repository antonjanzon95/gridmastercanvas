import "./style.css";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

document.querySelector("#app").innerHTML = `
  <div class="flex justify-center items-center h-screen bg-teal-900">
    <h1 class="bg-red-500 text-6xl font-extrabold p-4">Hello World</h1>
  </div>
`;
