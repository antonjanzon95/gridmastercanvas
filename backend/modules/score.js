const { ROOMS } = require("../modules/variables");
const ScoreModel = require("../models/ScoreModel");

function calculateScore(room) {
  const currentRoom = ROOMS.find(
    (currentRoom) => currentRoom.roomId == room.roomId
  );
  let score = 0;
  let whiteCounter = 0;
  const gridLength = currentRoom.grid.length;

  for (let i = 0; i < gridLength; i++) {
    if (
      currentRoom.grid[i].color == currentRoom.solutionGrid[i].color &&
      currentRoom.grid[i].color == "whitesmoke"
    ) {
      whiteCounter++;
    }
    if (
      currentRoom.grid[i].color == currentRoom.solutionGrid[i].color &&
      currentRoom.grid[i].color != "whitesmoke"
    ) {
      score++;
    }
  }

  const scoreInPercent = (score / (gridLength - whiteCounter)) * 100;

  return Math.floor(scoreInPercent);
}

async function saveScoreInDb(users, score) {
  const userNames = users.map((user) => user.name);
  const toSave = { users: userNames, score: score, date: new Date() };

  const save = await ScoreModel.create(toSave);
}

module.exports = { calculateScore, saveScoreInDb };
