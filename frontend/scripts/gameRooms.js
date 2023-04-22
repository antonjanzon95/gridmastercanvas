import { socket } from "../main";
import { createButton } from "./buttons";
import { createGameLobbyPage } from "./gameLobby";

// create room
function createNewRoom() {
  const user = { id: socket.id, name: "Anton", color: "blue" }; // från session
  socket.emit("create room", user);

  socket.on("create room", (createRoomResponse) => {
    enterRoomLobby(createRoomResponse);
    socket.off("monitorRooms");
  });

  socket.on("joinRoom", (room) => {
    createGameLobbyPage(room);
  });
}

function enterRoomLobby(room) {
  // enable chat
  createGameLobbyPage(room);
}

export function renderRoomsSection() {
  const mainContainer = document.querySelector("main");
  const roomsContainer = document.createElement("div");
  const roomsBtnContainer = document.createElement("div");

  mainContainer.innerHTML = "";

  roomsContainer.classList.add("rooms-container");

  const createRoomBtn = createButton("Create Room", createNewRoom);
  const joinRoomBtn = createButton("Join This Room", joinActiveRoom);

  roomsBtnContainer.append(createRoomBtn, joinRoomBtn);
  mainContainer.append(roomsContainer, roomsBtnContainer);
  monitorRoomList();
  printRoomList();
}

function monitorRoomList() {
  socket.on("monitorRooms", () => {
    console.log("socket on monitorRooms");
    printRoomList();
  });
}

async function printRoomList() {
  const roomsContainer = document.querySelector(".rooms-container");
  roomsContainer.innerHTML = "";
  const rooms = await fetchRooms();

  if (rooms.length === 0) {
    roomsContainer.innerHTML = "No active game rooms";
  } else {
    rooms.map((room, index) => {
      const roomContainer = document.createElement("div");
      const titleElement = document.createElement("h4");

      roomContainer.classList.add("room-container");

      titleElement.innerHTML = "Room " + (index + 1);

      const joinBtn = createButton("Join Room", joinActiveRoom);
      joinBtn.id = room.roomId;

      if (room.isFull) {
        joinBtn.setAttribute("disabled", "");
        joinBtn.innerHTML = "FULL";
      }

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
  socket.off("monitorRooms");
  const user = { id: socket.id, name: "Max" };
  localStorage.setItem("user", JSON.stringify(user));
  const roomId = e.target.id;

  const toSend = {
    user: user,
    roomId: roomId,
  };

  socket.emit("joinRoom", toSend);
  socket.emit("monitorRooms");

  socket.on("joinRoom", (room) => {
    createGameLobbyPage(room);
  });
}

// testing purposes users
// function testingUsers() {}
