let rooms = [];
const GRID_CELL_COUNT = 225;

function createEmptyGrid() {
  const emptyGrid = [];
  for (let i = 0; i < GRID_CELL_COUNT; i++) {
    const cell = { color: "whitesmoke" };
    emptyGrid.push(cell);
  }
  return emptyGrid;
}

function createFacitGrid(roomUsers) {
  const facitGrid = [];
  for (let i = 0; i < GRID_CELL_COUNT; i++) {
    const randomColorArray = roomUsers.map((user) => user.color);
    randomColorArray.push("whitesmoke");
    const randomIndex = Math.floor(Math.random() * randomColorArray);
    const cell = { color: randomColor[randomIndex] };
    facitGrid.push(cell);
  }
  return facitGrid;
}

function updateGrid(cell) {
  const activeRoom = rooms.find((room) => room.roomId === cell.roomId);

  const index = cell.cellId;

  activeRoom.grid[index].color =
    activeRoom.grid[index].color !== "whitesmoke" ? "whitesmoke" : cell.color;

  let updatedCell = {
    id: index,
    color: activeRoom.grid[index].color,
  };

  return updatedCell;
}

module.exports = { rooms, createEmptyGrid, updateGrid, createFacitGrid };
