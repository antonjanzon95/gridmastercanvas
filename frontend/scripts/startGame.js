import { socket } from "../main";
import { renderRoomUsers } from "./gameLobby";
import { saveScore, showGameOverPage } from "./gameover";
import { createGrid } from "./paintGrid";

export function createGamePage(room) {
  socket.off("readyCheck");

  const mainContainer = document.querySelector("main");
  const user = { id: socket.id, name: "Anton", color: "blue" };

  mainContainer.innerHTML = "";

  createGrid(room);
  let usersInLobby = renderRoomUsers(room.users);
  mainContainer.appendChild(usersInLobby);

  socket.on("gameOver", (scoreInPercent) => {
    // WORK IN PROGRESS
    if (user.id === room.users[0].id) {
      console.log(user.id);
      saveScore({ users: room.users, score: scoreInPercent });
    }

    showGameOverPage(scoreInPercent);
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
      socket.emit("gameOver", room);
    }
  }, 1000);
}
