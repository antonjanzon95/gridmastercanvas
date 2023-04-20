let rooms = [];
const GRID_CELL_COUNT = 225;

function createEmptyGrid() {
  const grid = [];
  for (let i = 0; i < GRID_CELL_COUNT; i++) {
    const cell = { color: "whitesmoke" };
    grid.push(cell);
  }
  return grid;
}

function updateGrid(cell) {
  const activeRoom = rooms.find((room) => room.roomId === cell.roomId);

  const index = cell.cellId;

  if (activeRoom.grid[index].color !== "whitesmoke") {
    activeRoom.grid[index].color = "whitesmoke";
  } else {
    activeRoom.grid[index].color = cell.color;
  }

  let updatedCell = {
    id: index,
    color: activeRoom.grid[index].color,
  };

  return updatedCell;
}

module.exports = { rooms, createEmptyGrid, updateGrid };
