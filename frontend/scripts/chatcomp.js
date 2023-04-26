import { socket } from "../main";

export function renderChatHtml() {
  const chatDiv = document.querySelector("#chat-div");
  chatDiv.innerHTML = "";

  chatDiv.innerHTML = `
  <section class="story-highlights">
      <p>Users online:</p>
        <div class="scroll-container">
        <div class="item">
            <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        <div class="item">
        <div class="user-color-circle"></div>
            <p>username</p>
        </div>
        
      </div>
    </section>
  <div class="chat-btn-wrapper">
    <button class="global-chat active-chat-btn" id="global-chat">GLOBAL chat</button>
    <button class="room-chat" id="room-chat">ROOM chat</button>
    <button class="material-symbols-outlined" id="light-dark-mode">
    dark_mode
    </button>
  </div>
    <div class="chat-container">
        <div class="messages" id="messages"></div>
      <input type='text' id='send-message' placeholder='Lets chat'/>
        <button id='send-button' class="send-button">Send</button>
    </div>
  `;

  let globalChatBtn = document.querySelector("#global-chat");
  let roomChatBtn = document.querySelector("#room-chat");
  let sendButton = document.querySelector(".send-button");
  let sendMessage = document.querySelector("#send-message");
  let lightdarkBtn = document.querySelector("#light-dark-mode");
  let isDarkMode = false;
  roomChatBtn.disabled = true;
  globalChatBtn.disabled = true;

  globalChatBtn.addEventListener("click", () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    user.currentChat = "global";
    sessionStorage.setItem("user", JSON.stringify(user));
    roomChatBtn.classList.remove('showChat');
    globalChatBtn.classList.add('showChat');
    roomChatBtn.disabled = false;
    globalChatBtn.disabled = true;
    renderChat(JSON.parse(sessionStorage.getItem("globalMessages")));
  });

  roomChatBtn.addEventListener("click", async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userRoomId = user.roomId;
    user.currentChat = "local";
    sessionStorage.setItem("user", JSON.stringify(user));
    roomChatBtn.classList.add('showChat');
    globalChatBtn.classList.remove('showChat');
    globalChatBtn.disabled = false;
    roomChatBtn.disabled = true;
    const roomMessages = await fetchRoomMessages(userRoomId);
    renderChat(roomMessages);
  });


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

  lightdarkBtn.addEventListener("click", () => {
    console.log("lets change light-dark-mode");
    let body = document.body;

    if (isDarkMode) {
      lightdarkBtn.innerHTML = "dark_mode";
      body.classList.remove("dark");
    } else {
      lightdarkBtn.innerHTML = "light_mode";
      body.classList.add("dark");
    }
    isDarkMode = !isDarkMode;
  });
}

async function fetchRoomMessages(roomId) {
  const response = await fetch(
    "http://localhost:3000/rooms/messages/" + roomId
  );
  const data = await response.json();

  return data;
}

function calculateLuminance(color) {
  const rgb = hexToRgb(color);
  //Luminance (perceived option 1): (0.299*R + 0.587*G + 0.114*B)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance;
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");

  //convert hex to integer,
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function sendChat() {
  const messageInput = document.querySelector("#send-message");
  let user = JSON.parse(sessionStorage.getItem("user"));

  const messageToGlobal = {
    message: messageInput.value,
    user: user.name,
    color: user.color,
  };

  const messageToLocal = {
    message: messageInput.value,
    user: user,
  };

  if (user.currentChat == "global") {
    socket.emit("globalMessage", messageToGlobal);
    messageInput.value = "";
  } else if (user.currentChat == "local") {
    socket.emit("localMessage", messageToLocal);
    messageInput.value = "";
  } else {
    return;
  }
}

export function renderChat(messages) {
  let globalChatBtn = document.querySelector("#global-chat");
  let roomChatBtn = document.querySelector("#room-chat");
  const chatWindow = document.querySelector("#messages");
  chatWindow.innerHTML = "";
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (user.currentChat == "global") {
    globalChatBtn.classList.add("active-chat-btn");
    roomChatBtn.classList.remove("active-chat-btn");
  } else if (user.currentChat == "local") {
    roomChatBtn.classList.add("active-chat-btn");
    globalChatBtn.classList.remove("active-chat-btn");
  }

  if (messages == undefined) {
    return console.log("undefineeeed");
  }

  messages.forEach((message) => {
    let chat = document.createElement("div");
    chat.setAttribute("class", "message");
    chat.innerHTML = message.user + ": " + message.message;

    if (message.user === user.name) {
      chat.setAttribute("class", "send-message");
    } else {
      chat.setAttribute("class", "receive-message");
    }

    if (message.color) {
      chat.style.backgroundColor = message.color;
      const luminance = calculateLuminance(message.color);
      if (luminance > 0.5) {
        chat.style.color = "#1b1b1b";
      } else {
        chat.style.color = "whitesmoke";
      }
    }

    chatWindow.appendChild(chat);
  });
}
