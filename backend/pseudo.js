// //************** FRONT END **************//

// socket.emit("create room", user); // knapp skapa rum


// socket.on("create startGrid", (emptyGrid) => {
// // rendera tomt grid
// // rendera connected users namn

// });

// socket.emit("join room", user);

// socket.on("join room", ({ users: [string], grid }) => {
// // rendera current grid

// });

// socket.emit("paint", { room.id, room.grid, user.color, cell.id });

// socket.on("paint", (cellId, color) => {
// const cell = document.querySelector(`#${cellId}`);
// cell.style.backgroundColor = color;

// })

// //************** BACK END **************//

// const rooms = [];

// socket.on("create room", (user) => {
// const roomGrid = createEmptyGrid();
// const facitGrid = createFacitGrid();
// const startingRoom = { id, users: [user], roomGrid, facitGrid }; //
// rooms.push(startingRoom);
// io.emit("create startGrid", startingRoom); // funktion med vit grid

// });

// socket.on("startGame", (game) => {
//   const facitGrid = createFacitGrid();
// })

// socket.on("join room", ({ user, roomId }) => {
// const roomToJoin = rooms.find((id) => roomId == id);
// const joinedRoom = { ...roomToJoin, users: [...roomToJoin.users, user] };
// io.emit("join room", joinedRoom);

// });

// socket.on("paint", (object) => {
// const roomGridToUpdate = rooms.find((id) => room.id === id);

// if (object.grid[object.cellId].color == "whitesmoke") {
// object.grid[object.cellId].color = object.color;
// roomGridToUpdate.roomGrid[cellId].color = object.color;
// } else {
// object.grid[object.cellId].color = "whitesmoke";
// roomGridToUpdate.roomGrid[cellId].color = "whitesmoke";
// }

// socket.emit("paint", { cellId, color });

// });
