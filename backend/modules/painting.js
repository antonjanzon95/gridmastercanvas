const GRID_SIZE = 15;
const GRID_CELL_COUNT = GRID_SIZE ** 2;
const { ROOMS } = require("./variables");

function createEmptyGrid() {
  const emptyGrid = [];
  for (let i = 0; i < GRID_CELL_COUNT; i++) {
    const cell = { color: "whitesmoke" };
    emptyGrid.push(cell);
  }
  return emptyGrid;
}

function createSolutionGrid(roomUsers) {
  const solutionGrid = [];
  for (let i = 0; i < GRID_CELL_COUNT; i++) {
    const randomColorArray = roomUsers.map((user) => user.gameColor);
    randomColorArray.push("whitesmoke");
    const randomIndex = Math.floor(Math.random() * randomColorArray.length);
    const cell = { color: randomColorArray[randomIndex] };
    solutionGrid.push(cell);
  }
  return solutionGrid;
}

function updateGrid(cell) {
  const activeRoom = ROOMS.find((room) => room.roomId === cell.roomId);

  const index = cell.cellId;

  activeRoom.grid[index].color =
    activeRoom.grid[index].color !== "whitesmoke" ? "whitesmoke" : cell.color;

  let updatedCell = {
    id: index,
    color: activeRoom.grid[index].color,
  };

  return updatedCell;
}

module.exports = { createEmptyGrid, updateGrid, createSolutionGrid };
