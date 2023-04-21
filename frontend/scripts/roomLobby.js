import { socket } from "../main";
import { createGridPage } from "./canvas";

// create room
function createNewRoom() {
  const user = { id: socket.id, name: "Anton", color: "blue" }; // från session
  socket.emit("create room", user);

  socket.on("create room", (createRoomResponse) => {
    enterRoomLobby(createRoomResponse);
  });
}

function enterRoomLobby(room) {
  // enable chat
  createGridPage(room);
}

export function renderRoomsSection() {
  const mainContainer = document.querySelector("main");
  const roomsContainer = document.createElement("div");
  const roomsBtnContainer = document.createElement("div");
  const createRoomBtn = document.createElement("button");
  const joinRoomBtn = document.createElement("button");

  mainContainer.innerHTML = "";

  roomsContainer.classList.add("rooms-container");

  createRoomBtn.innerText = "Create room";
  createRoomBtn.classList.add("btn");
  createRoomBtn.addEventListener("click", createNewRoom);

  joinRoomBtn.innerText = "Join this room";
  joinRoomBtn.classList.add("btn");
  joinRoomBtn.addEventListener("click", joinActiveRoom);

  roomsBtnContainer.append(createRoomBtn, joinRoomBtn);
  mainContainer.append(roomsContainer, roomsBtnContainer);
  printRoomList();
}

async function printRoomList() {
  const roomsContainer = document.querySelector(".rooms-container");
  const rooms = await fetchRooms();
  if (rooms.length === 0) {
    roomsContainer.innerHTML = "No active game rooms";
  } else {
    rooms.map((room, index) => {
      const roomContainer = document.createElement("div");
      const titleElement = document.createElement("h4");
      const joinBtn = document.createElement("button");

      roomContainer.classList.add("room-container");

      titleElement.innerHTML = "Room " + (index + 1);

      joinBtn.classList.add("btn");
      joinBtn.id = room.roomId;
      joinBtn.innerText = "Join room";
      joinBtn.addEventListener("click", joinActiveRoom);

      roomContainer.append(titleElement, joinBtn);
      roomsContainer.appendChild(roomContainer);
    });
  }
}

async function fetchRooms() {
  const response = await fetch("http://localhost:3000/rooms");
  const data = await response.json();
  return data.rooms;
}

function joinActiveRoom(e) {
  const user = { id: socket.id, name: "Max", color: "red" };
  const roomId = e.target.id;

  const toSend = {
    user: user,
    roomId: roomId,
  };

  socket.emit("join room", toSend);

  socket.on("join room", (room) => {
    console.log(room);
    createGridPage(room);
  });
}
