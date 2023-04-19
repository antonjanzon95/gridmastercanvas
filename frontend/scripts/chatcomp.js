import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:5173");
export function renderChatHtml() {
  console.log("Hej från chat!");

  const chatDiv = document.querySelector("#chat-div");

  chatDiv.innerHTML = `<div class="chat-container">
  <div id="messages"></div>
  <input type='text' id='send-message' placeholder='Lets chat'/>
  <button id='send-button'>Send</button>
</div>`;

  let messages = document.querySelector("#messages");
  let sendButton = document.querySelector("#send-button");
  let sendMessage = document.querySelector("#send-message");

  //   socket.on("message", (arg) => {
  //     console.log("message", arg);
  //     // messages.innerHTML = arg.user + " " + arg.chat;
  socket.on("message", (data) => {
    console.log(data);
  });

  socket.emit("hej", "Hej");

  socket.on("hej", (arg) => {
    console.log(arg);
  });

  socket.on("hejhej", (arg) => {
    console.log(arg);
  });

  sendButton.addEventListener("click", () => {
    console.log("Klick på knapp");
  });
}
