import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("http://localhost:3000");

export function renderChatHtml() {
  let user = JSON.parse(sessionStorage.user);
  console.log("Hej från chat!");
  console.log(user);

  const chatDiv = document.querySelector("#chat-div");

  chatDiv.innerHTML = `
  <div>Show users online + darkmode Btn</div>
    <div class="chat-container">
        <div class="messages" id="messages"></div>
      <input type='text' id='send-message' placeholder='Lets chat'/>
        <button id='send-button' class="send-button">Send</button>
    </div>
  `;

  let messages = document.querySelector("#messages");
  let sendButton = document.querySelector("#send-button");
  let sendMessage = document.querySelector("#send-message");

  socket.on("message", (msg) => {
    let user = JSON.parse(sessionStorage.user);
    console.log(msg);
    let chat = document.createElement("div");
    chat.setAttribute("class", "message");

    if (msg.user === user.name) {
      chat.setAttribute("class", "send-message");
    } else {
      chat.setAttribute("class", "receive-message");
    }

    if (msg.color) {
      chat.style.backgroundColor = msg.color;
      const luminance = calculateLuminance(msg.color);
      if (luminance > 0.5) {
        chat.style.color = "#1b1b1b";
      } else {
        chat.style.color = "whitesmoke";
      }
    }

    chat.innerHTML = msg.user + ": " + msg.message;
    messages.insertBefore(chat, messages.firstChild);
    messages.scrollTop = messages.scrollHeight;
  });

  function sendChat() {
    let user = JSON.parse(sessionStorage.user);

    console.log(user);
    console.log(user.color);

    socket.emit("message", {
      message: sendMessage.value,
      user: user.name,
      color: user.color,
    });
    sendMessage.value = "";
  }

  function calculateLuminance(color) {
    console.log(color);
    const rgb = hexToRgb(color);
    //Luminance (perceived option 1): (0.299*R + 0.587*G + 0.114*B)
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    console.log(luminance)

    return luminance;
  }

  function hexToRgb(hex) {
    console.log(hex);
    hex = hex.replace("#", "");
    console.log(hex);

    //convert hex to integer,
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    console.log({ r, g, b });

    return { r, g, b };
  }

  sendMessage.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      sendChat();
    }
  });

  sendButton.addEventListener("click", () => {
    console.log("Klick på knapp");
    sendChat();
  });
}
