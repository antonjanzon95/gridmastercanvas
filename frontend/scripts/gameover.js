export const showGameOverPage = (finalScore) => {
  const mainContainer = document.querySelector("main");
  mainContainer.innerHTML = "";

  const score = document.createElement("h1");
  score.classList.add("score-text");
  score.innerHTML = `Good Job! You got ${Math.floor(finalScore)}% correct!`;

  mainContainer.appendChild(score);
};
