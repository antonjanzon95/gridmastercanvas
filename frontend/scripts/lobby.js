import { socket } from "../main.js";
import { createGridPage, createSolutionGrid } from "./canvas.js";
import { saveImagePost } from "./saveImg.js";
import { fetchImages, renderImages } from "./showimgs.js";

export function renderRoomsSection() {
  const mainContainer = document.querySelector("main");
  const roomsContainer = document.createElement("div");
  const roomsBtnContainer = document.createElement("div");
  const createRoomBtn = document.createElement("button");
  const joinRoomBtn = document.createElement("button");

  mainContainer.innerHTML = '';

  roomsContainer.classList.add('rooms-container');

  createRoomBtn.innerText = 'Create room';
  createRoomBtn.classList.add('btn');
  createRoomBtn.addEventListener('click', createNewRoom);

  joinRoomBtn.innerText = 'Join room';
  joinRoomBtn.classList.add('btn');
  joinRoomBtn.addEventListener('click', joinActiveRoom);

  roomsBtnContainer.append(createRoomBtn, joinRoomBtn);
  mainContainer.append(roomsContainer, roomsBtnContainer);
  printRoomList();
}

async function printRoomList() {
  const roomsContainer = document.querySelector('.rooms-container');
  const rooms = await fetchRooms();
  if (rooms.length === 0) {
    roomsContainer.innerHTML = "No active game rooms";
  }
  else {
    rooms.map((room, index) => {
      const roomContainer = document.createElement("div");
      const titleElement = document.createElement("h4");
      const joinBtn = document.createElement("button");
  
      roomContainer.classList.add("room-container");

      titleElement.innerHTML = "Room " + (index + 1);

      joinBtn.classList.add('btn');
      joinBtn.id = room.roomId;
      joinBtn.innerText = 'Join room';

      roomContainer.append(titleElement, joinBtn);
      roomsContainer.appendChild(roomContainer);
    })
  }

}


function createNewRoom() {
  const user = { name: "Anton", color: "blue" }; // från session
  socket.emit("create room", user);
  
  socket.on("create room", (createRoomResponse) => {
    console.log(createRoomResponse);
    enterRoomLobby(createRoomResponse);
  })
  console.log('skapa rum');
}

function enterRoomLobby(room) {
  // enable chat
  createGridPage(room)
}

async function fetchRooms() {
  const response = await fetch("http://localhost:3000/rooms");
  const data = await response.json();
  return data.rooms;
}

function joinActiveRoom() {
  createSolutionGrid();
}

export const createPracticeGridPage = () => {
  const mainContainer = document.querySelector("main");
  const buttonContainer = document.createElement("div");
  // const user = { name: "Anton", color: "blue" };
  sessionStorage.setItem("user", JSON.stringify(user));
  // const userFromStorage = JSON.parse(sessionStorage.getItem("user"));

  socket.emit("roomJoin", user);

  mainContainer.innerHTML = "";

  socket.on("roomJoin", (roomIsFull) => {
    if (roomIsFull) {
      mainContainer.innerHTML = 'Du får inte va med :(';
      return;
    }
  })

  socket.on("createGrid", (gameGrid) => {
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("canvas-grid", "rounded");
    mainContainer.appendChild(gridContainer);
  
    let idcounter = 0;
    
    //create the grid
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        const gridNode = document.createElement("div");
        gridNode.classList.add("cell");
        gridNode.id = idcounter;
        gridNode.style.backgroundColor = gameGrid[idcounter].color;
        
  
        gridNode.addEventListener("click", (e) => {

            socket.emit("paintEvent", {
              cell: e.target.id,
              user: user
            }); 
            
        });
        gridContainer.appendChild(gridNode);
        idcounter++;
      }
    }
    buttonContainer.classList.add("btn-container");
    mainContainer.appendChild(buttonContainer);
  
  
    // save practice image button
    const saveImageBtn = document.createElement("button");
    saveImageBtn.innerHTML = "Save Image";
    saveImageBtn.classList.add("btn");
  
    // save practice image
    saveImageBtn.addEventListener("click", () => {
      // ändra till att alla 4 users sparas med bilden <--
      const saveImage = { user: user, image: practiceImageNode };
      // localStorage.setItem("images", JSON.stringify(siaveImage));
  
      saveImagePost(saveImage);
    });
  
    // start game button
    const startBtn = document.createElement("button");
    startBtn.innerHTML = "Start Game";
    startBtn.classList.add("btn");
  
    // set user is done on click
    startBtn.addEventListener("click", () => {
      sessionStorage.setItem("user", JSON.stringify({ ...user, ready: true }));
      const usertest = JSON.parse(sessionStorage.getItem("user"));
  
      // set to all 4 users ready later <--
      if (usertest.ready) {
        hidePracticeGridPage(gridContainer);
        startGame();
      }
    });
  
    // save practice image button
    const newGridBtn = document.createElement("button");
    newGridBtn.innerHTML = "New Canvas";
    newGridBtn.classList.add("btn");
  
    // save practice image
    newGridBtn.addEventListener("click", createPracticeGridPage);
  
    buttonContainer.appendChild(startBtn);
    buttonContainer.appendChild(saveImageBtn);
    buttonContainer.appendChild(newGridBtn);
  })



  // let practiceImageNode = [];

  // const gridContainer = document.createElement("div");
  // gridContainer.classList.add("canvas-grid", "rounded");
  // mainContainer.appendChild(gridContainer);

  // const buttonContainer = document.createElement("div");
  // buttonContainer.classList.add("btn-container");
  // mainContainer.appendChild(buttonContainer);

  // //create the grid
  // for (let i = 0; i < 15; i++) {
  //   for (let j = 0; j < 15; j++) {
  //     const gridNode = document.createElement("div");
  //     gridNode.classList.add("cell");
  //     gridNode.style.backgroundColor = "whitesmoke";

  //     let cell = {
  //       color: "whitesmoke",
  //     };

  //     practiceImageNode.push(cell);
  //     let id = idcounter;

  //     gridNode.addEventListener("click", () => {
  //       if (gridNode.style.backgroundColor == "whitesmoke") {
  //         gridNode.style.backgroundColor = user.color;
  //         practiceImageNode[id].color = user.color;
  //       } else {
  //         gridNode.style.backgroundColor = "whitesmoke";
  //         practiceImageNode[id].color = "whitesmoke";
  //       }
  //     });
  //     gridContainer.appendChild(gridNode);
  //     idcounter++;
  //   }
  // }


};

export const startGame = () => {
  
  createSolutionGrid();
};

const hidePracticeGridPage = (practiceGridContainer) => {
  practiceGridContainer.innerHTML = "";
};
