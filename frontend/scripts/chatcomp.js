import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:3000");

export function renderChatHtml() {
  // localStorage.setItem('userName', 'user1');
  // localStorage.setItem('userColor', 'blue');

  // localStorage.setItem('userName', 'User2');
  // localStorage.setItem('userColor', 'red');

  console.log("Hej från chat!");

  const chatDiv = document.querySelector("#chat-div");

  chatDiv.innerHTML = `
    <div class="chat-container">
        <div id="messages"></div>
      <input type='text' id='send-message' placeholder='Lets chat'/>
        <button id='send-button' class="send-button">Send</button>
    </div>
  `;

  let messages = document.querySelector("#messages");
  let sendButton = document.querySelector("#send-button");
  let sendMessage = document.querySelector("#send-message");

  socket.on("message", (msg) => {
    console.log(msg);
    let chat = document.createElement("div");
    chat.setAttribute("class", "message");

    if (msg.user === localStorage.getItem("userName")) {
      chat.setAttribute("class", "send-message");
    } else {
      chat.setAttribute("class", "receive-message");
    }

    chat.style.backgroundColor = msg.color;
    chat.innerHTML = msg.user + ": " + msg.message;
    messages.insertBefore(chat, messages.firstChild);
    messages.scrollTop = messages.scrollHeight;
  });

  sendButton.addEventListener("click", () => {
    console.log("Klick på knapp");
    let user = localStorage.getItem("userName");
    let color = localStorage.getItem("userColor");
    socket.emit("message", {
      message: sendMessage.value,
      user: user,
      color: color,
    });
    sendMessage.value = "";
  });
}
