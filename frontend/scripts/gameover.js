import { createButton } from "./buttons";
import { renderRoomsSection } from "./gameRooms";

export const showGameOverPage = (finalScore) => {
  // let roomChatBtn = document.querySelector("#room-chat");
  // roomChatBtn.disabled = true;

  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";

  const score = document.createElement("h1");
  score.classList.add("score-text");
  score.innerHTML = `Good Job! You got ${finalScore}% correct!`;

  const playAgainBtn = document.createElement("button");
  playAgainBtn.classList.add("btn");
  playAgainBtn.innerHTML = "Play Again";
  playAgainBtn.addEventListener("click", () => {
    renderRoomsSection();
  });

  const highScoreBtn = createButton("Highscores", showHighScorePage);

  mainContainer.appendChild(score);
  mainContainer.appendChild(highScoreBtn);
  mainContainer.appendChild(playAgainBtn);
};

export async function showHighScorePage() {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";
  const highScoresContainer = document.createElement("div");
  highScoresContainer.classList.add("highscores-container");

  const headingsContainer = document.createElement("div");
  headingsContainer.classList.add("headings-container");
  const usersHeading = document.createElement("h2");
  usersHeading.classList.add("users-heading");
  usersHeading.innerHTML = "Users";
  const scoreHeading = document.createElement("h2");
  scoreHeading.classList.add("score-heading");
  scoreHeading.innerHTML = "Score";

  headingsContainer.append(usersHeading, scoreHeading);
  highScoresContainer.appendChild(headingsContainer);

  const highScores = await fetchHighscores();

  const sortedScores = highScores.sort((a, b) => b.score - a.score);

  sortedScores.forEach((highscore, index) => {
    if (index > 9) {
      return;
    }

    const scoreContainer = document.createElement("div");
    scoreContainer.classList.add("highscore-container");

    const users = document.createElement("p");
    users.classList.add("highscore-names");

    users.innerHTML = highscore.users.join();

    const score = document.createElement("p");
    score.classList.add("highscore-score");
    score.innerHTML = highscore.score + "%";

    switch (index) {
      case 0:
        score.classList.add("first-place");
        score.classList.add("medal");
        break;
      case 1:
        score.classList.add("second-place");
        score.classList.add("medal");
        break;
      case 2:
        score.classList.add("third-place");
        score.classList.add("medal");
        break;
      default:
        score.style.backdropColor = "inherit";
    }

    const date = document.createElement("p");
    date.classList.add("highscore-date");
    const convertedDate = new Date(highscore.date);

    date.innerHTML = convertedDate.toLocaleString();

    scoreContainer.append(users, score, date);
    highScoresContainer.appendChild(scoreContainer);
  });

  mainContainer.append(highScoresContainer);
}

async function fetchHighscores() {
  const response = await fetch("http://localhost:3000/highscores");
  const data = await response.json();

  return data;
}
