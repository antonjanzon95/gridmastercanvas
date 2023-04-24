import './styles/style.css';
import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js';
import { viewSavedImages } from './scripts/saveImg';
import { initLog } from './scripts/log';
import { renderRoomsSection } from './scripts/gameRooms';
import { renderChatHtml } from './scripts/chatcomp';
import { renderFooter } from './scripts/footerComp';

export let grids = {};
export const socket = io('http://localhost:3000');

// document.querySelector('#app').innerHTML = `
//   <div class="h-screen bg-teal-900 parent">
//     <header class="div1 w-full h-full">header</header>
//       <section class="div5 w-full h-full">regler</section>
//       <section class="div4 w-full h-full"></section>
//       <main class="div3 w-full h-full p-4 flex justify-center items-center gap-4"></main>
//       <aside class="div2 w-full h-full" id="chat-div">chat</aside>
//   </div>
//   <footer id="footer"></footer>
// `;

document.querySelector(
  '#app'
).innerHTML = `<div class='h-screen bg-teal-900 parent'>
<header class='header w-full h-full'>header</header>
<div class='main w-full h-full'>main </div>
<div class='chat w-full h-full'>chat </div>
<div id='footer w-full h-full' class='footer'>footer </div>
</div>;`;

const init = () => {
  initLog();
  // renderChatHtml();
  renderFooter();
  renderRoomsSection();
  viewSavedImages();
};

init();
