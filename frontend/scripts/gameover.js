// import { renderRoomsSection } from "./lobby";

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

  const highscoreBtn = document.createElement("button");
  highscoreBtn.classList.add("btn");
  highscoreBtn.innerHTML = "Highscores";
  highscoreBtn.addEventListener("click", () => {});

  mainContainer.appendChild(highscoreBtn);
  mainContainer.appendChild(playAgainBtn);
  mainContainer.appendChild(score);
};

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
