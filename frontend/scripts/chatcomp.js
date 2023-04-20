import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:3000");
export function renderChatHtml() {
  console.log("Hej från chat!");
  localStorage.setItem("username", "user1");
  localStorage.setItem("usercolor", "green");

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

  socket.on("message", (msg) => {
    console.log(msg);
    let chat = document.createElement("div");
    chat.style.backgroundColor = msg.color;
    chat.innerHTML = msg.user + ": " + msg.message;
    messages.appendChild(chat);
  });

  //   socket.emit("hej", "Hej");

  //   socket.on("hej", (arg) => {
  //     console.log(arg);
  //   });

  //   socket.on("hejhej", (arg) => {
  //     console.log(arg);
  //   });

  sendButton.addEventListener("click", () => {
    console.log("Klick på knapp");
    let user = localStorage.getItem("username");
    let color = localStorage.getItem("usercolor");
    socket.emit("message", {
      message: sendMessage.value,
      user: user,
      color: color,
    });
    console.log(sendMessage.value);
    sendMessage.value = "";
  });
}
