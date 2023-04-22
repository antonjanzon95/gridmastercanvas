import { socket } from "../main";
import { renderRoomUsers } from "./gameLobby";
import { showGameOverPage } from "./gameover";
import { createGrid } from "./paintGrid";

export function createGamePage(room) {
  const mainContainer = document.querySelector("main");
  const user = { name: "Anton", color: "blue" };

  mainContainer.innerHTML = "";

  createGrid(room);
  let usersInLobby = renderRoomUsers(room.users);
  mainContainer.appendChild(usersInLobby);

  socket.on("gameOver", (scoreInPercent) => {
    showGameOverPage(scoreInPercent);
  });

  let gameTimer = 1;
  const gameTimerHeading = document.createElement("h2");
  gameTimerHeading.classList.add("game-timer");
  gameTimerHeading.innerHTML = gameTimer;

  const gameTimerInterval = setInterval(() => {
    gameTimerHeading.innerHTML = gameTimer.toString();
    gameTimer--;
    if (gameTimer < 1) {
      clearInterval(gameTimerInterval);
      socket.emit("gameOver", room);
    }
  }, 1000);
}
