import { createButton } from "./buttons";
import { renderRoomsSection } from "./gameRooms";

export const showGameOverPage = (finalScore) => {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";

  const score = document.createElement("h1");
  score.classList.add("score-text");
  score.innerHTML = `Good Job! You got ${Math.floor(finalScore)}% correct!`;

  const playAgainBtn = document.createElement("button");
  playAgainBtn.classList.add("btn");
  playAgainBtn.innerHTML = "Play Again";
  playAgainBtn.addEventListener("click", () => {
    renderRoomsSection();
  });

  const highScoreBtn = createButton("Highscores", showHighScorePage);

  mainContainer.appendChild(highScoreBtn);
  mainContainer.appendChild(playAgainBtn);
  mainContainer.appendChild(score);
};

async function showHighScorePage() {
  const mainContainer = document.querySelector("main");

  const highScoresContainer = document.createElement("div");
  highScoresContainer.classList.add("highscores-container");

  const highScores = await fetchHighscores();

  highScores.forEach((highscore) => {
    const scoreContainer = document.createElement("div");
    scoreContainer.classList.add("highscore-container");

    const users = document.createElement("p");
    users.innerHTML = highscore.users.join();

    const score = document.createElement("p");
    score.innerHTML = highscore.score;

    const date = document.createElement("p");
    date.innerHTML = highscore.date.toLocaleString();

    scoreContainer.append(users, score, date);
    highScoresContainer.appendChild(scoreContainer);
  });

  mainContainer.appendChild(highScoresContainer);
}

async function fetchHighscores() {
  const response = await fetch("http://localhost:3000/highscores");
  const data = await response.json();

  return data;
}

// calculate score
export function compareTryToSolution(currentGrid, solution) {
  let correctChoice = 0;

  for (let i = 0; i < solution.length; i++) {
    if (currentGrid[i].color === solution[i].color) {
      correctChoice++;
    }
  }

  let correctAmountInPercentage = (correctChoice / solution.length) * 100;

  return correctAmountInPercentage;
}
