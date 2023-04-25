import "./styles/style.css";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { initLog } from "./scripts/log";
import { renderChat } from "./scripts/chatcomp";
import { renderFooter } from "./scripts/footerComp";

export let grids = {};
export const socket = io("http://localhost:3000");

document.querySelector("#app").innerHTML = `
<div class='h-screen bg-teal-900 parent'>
  <header class="header w-full h-full" id="header"></header>
  <main class="main w-full h-full p-4 flex justify-center items-center gap-4"></main>
  <aside class="chat w-full h-full chat-div" id="chat-div">chat </aside>
  
</div>
<footer id='footer' class='footer w-full h-full'>footer </footer>`;

const init = () => {
  initSockets();
  initLog();
  // renderHeader();
  // renderChatHtml();
  renderFooter();
  // viewSavedImages();
};

init();

function initSockets() {
  socket.on("globalMessage", (msg) => {
    let user = JSON.parse(sessionStorage.getItem("user"));

    const globalChat = {
      user: msg.user,
      message: msg.message,
      color: msg.color,
    };

    const globalMessages = JSON.parse(sessionStorage.getItem("globalMessages"));
    globalMessages.unshift(globalChat);
    sessionStorage.setItem("globalMessages", JSON.stringify(globalMessages));

    // messages.insertBefore(chat, messages.firstChild);
    // messages.scrollTop = messages.scrollHeight;

    if (user.currentChat == "global") {
      renderChat(JSON.parse(sessionStorage.getItem("globalMessages")));
    }
  });
}

export function removeSockets() {
  socket.off("globalChat");
}
