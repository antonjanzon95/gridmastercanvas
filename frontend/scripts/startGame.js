import { socket } from "../main";
import { renderRoomUsers } from "./gameLobby";
import { saveScore, showGameOverPage } from "./gameover";
import { createGrid } from "./paintGrid";

export function createGamePage(room) {
  socket.off("readyCheck");

  const mainContainer = document.querySelector("main");
  // const user = { id: socket.id, name: "Anton", color: "blue" };

  mainContainer.innerHTML = "";

  createGrid(room);
  let usersInLobby = renderRoomUsers(room.users);
  mainContainer.appendChild(usersInLobby);

  socket.on("gameOver", (roomWithScore) => {
    if (roomWithScore.id != room.id) {
      return;
    }
    socket.off("gameOver");

    showGameOverPage(roomWithScore.score);
  });

  let gameTimer = 5;
  const gameTimerHeading = document.createElement("h2");
  gameTimerHeading.classList.add("game-timer");
  gameTimerHeading.innerHTML = gameTimer;
  mainContainer.appendChild(gameTimerHeading);

  const gameTimerInterval = setInterval(() => {
    gameTimerHeading.innerHTML = gameTimer.toString();
    gameTimer--;
    if (gameTimer < 0) {
      clearInterval(gameTimerInterval);
    }
  }, 1000);
}
