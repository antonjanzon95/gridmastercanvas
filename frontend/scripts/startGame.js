import { socket } from "../main";
import { renderRoomUsers } from "./gameLobby";
import { showGameOverPage } from "./gameover";
import { createGrid } from "./paintGrid";

export function createGamePage(room) {
  const mainContainer = document.querySelector("main");

  mainContainer.innerHTML = "";

  createGrid(room);
  let usersInLobby = renderRoomUsers(room.users);
  mainContainer.appendChild(usersInLobby);

  socket.on("gameOver", (roomWithScore) => {
    if (roomWithScore.id != room.id) {
      return;
    }

    showGameOverPage(roomWithScore.score);

    socket.off("gameOver");
    socket.off('gameCountdownTimer');
  });

  const gameTimerHeading = document.createElement("h2");
  gameTimerHeading.classList.add("game-timer");
  mainContainer.appendChild(gameTimerHeading);

  socket.on('gameCountdownTimer', (timerLeftInSeconds) => {
    gameTimerHeading.innerHTML = timerLeftInSeconds;
  })

}
