let rooms = [];
const GRID_CELL_COUNT = 225;

function createEmptyGrid() {
  const grid = [];
  for (let i = 0; i < GRID_CELL_COUNT; i++) {
    const cell = {color: "whitesmoke"};
    grid.push(cell);
  }
  return grid;
}

function updateGrid(cell) {
  const activeRoom = rooms.find((room) => room.roomId === cell.roomId);
  console.log(activeRoom);
  
  let updatedCell = {id: cell.cellId};
  if (activeRoom.grid[cell.cellId].color !== "whitesmoke") {
    activeRoom.grid[cell.cellId].color = "whitesmoke";
  }
  else {
    activeRoom.grid[cell.cellId].color = cell.color;
  }
  updatedCell.color = activeRoom.grid[cell.cellId].color;
  return updatedCell;
}

module.exports = { rooms, createEmptyGrid, updateGrid };