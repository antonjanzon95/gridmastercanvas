import { readyCheck } from "./gameLobby";
import { handleSaveImage } from "./saveImg";

export const createButton = (text, clickFunction) => {
  const button = document.createElement("button");
  button.innerHTML = text;
  button.classList.add("btn");
  button.addEventListener("click", clickFunction);

  return button;
};

export const createLobbyButtons = (roomId) => {
  const mainContainer = document.querySelector("main");
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("btn-container");
  mainContainer.appendChild(buttonContainer);

  // save practice image button
  const saveImageBtn = createButton("Save Image", handleSaveImage);
  saveImageBtn.id = roomId;

  // start game button
  const startBtn = createButton("Start Game", readyCheck);

  buttonContainer.append(startBtn, saveImageBtn);
};
