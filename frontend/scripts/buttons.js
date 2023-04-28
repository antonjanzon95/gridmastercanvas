import { leaveRoom, readyCheck } from './gameLobby';
import { showHighScorePage } from './gameover';
import { handleSaveImage } from './saveImg';

export const createButton = (text, clickFunction, id) => {
  const button = document.createElement('button');
  button.innerHTML = text;
  button.classList.add('btn');
  button.addEventListener('click', clickFunction);

  return button;
};

export const createLobbyButtons = (roomId) => {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('saveMessageDiv');
  const mainContainer = document.querySelector('main');
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('btn-container');
  mainContainer.appendChild(buttonContainer);

  const leaveBtn = createButton('Leave room', leaveRoom);

  const saveImageBtn = createButton('Save Image', handleSaveImage);
  saveImageBtn.id = roomId;

  const startBtn = createButton('Start Game', readyCheck);
  startBtn.id = roomId;

  buttonContainer.append(leaveBtn, startBtn, saveImageBtn, messageDiv);
};