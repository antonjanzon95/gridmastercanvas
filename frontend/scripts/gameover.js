import { createPracticeGridPage } from "./lobby";

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
    createPracticeGridPage();
  });

  const highscoreBtn = document.createElement("button");
  highscoreBtn.classList.add("btn");
  highscoreBtn.innerHTML = "Highscores";
  highscoreBtn.addEventListener("click", () => {});

  mainContainer.appendChild(highscoreBtn);
  mainContainer.appendChild(playAgainBtn);
  mainContainer.appendChild(score);
};
