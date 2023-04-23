const { rooms } = require("../modules/painting");

function calculateScore(room) {
  const currentRoom = rooms.find(
    (currentRoom) => currentRoom.roomId == room.roomId
  );
  let score = 0;
  const gridLength = currentRoom.grid.length;

  for (let i = 0; i < gridLength; i++) {
    if (currentRoom.grid[i].color == currentRoom.solutionGrid[i].color) {
      score++;
    }
  }

  const scoreInPercent = (score / gridLength) * 100;

  return scoreInPercent;
}

module.exports = { calculateScore };
