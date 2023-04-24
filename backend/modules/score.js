const { rooms } = require("../modules/variables");
const ScoreModel = require("../models/ScoreModel");

function calculateScore(room) {
  const currentRoom = rooms.find(
    (currentRoom) => currentRoom.roomId == room.roomId
  );
  let score = 0;
  let whiteSmokeCounter = 0;
  const gridLength = currentRoom.grid.length;

  for (let i = 0; i < gridLength; i++) {
    if (currentRoom.grid[i].color !== "whitesmoke") {
      if (currentRoom.grid[i].color == currentRoom.solutionGrid[i].color) {
        score++;
      }
    } else {
      whiteSmokeCounter++;
    }
  }

  const scoreInPercent = (score / (gridLength - whiteSmokeCounter)) * 100;

  return Math.floor(scoreInPercent);
}

async function saveScoreInDb(users, score) {
  const userNames = users.map((user) => user.name);
  const toSave = { users: userNames, score: score, date: new Date() };

  const save = await ScoreModel.create(toSave);
}

module.exports = { calculateScore, saveScoreInDb };
