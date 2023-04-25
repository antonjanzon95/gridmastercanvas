const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const imageRouter = require("./routes/image");
const roomsRouter = require("./routes/rooms");
const highScoresRouter = require("./routes/highscores");

const {
  createEmptyGrid,
  updateGrid,
  createSolutionGrid,
} = require("./modules/painting");
const { calculateScore, saveScoreInDb } = require("./modules/score");
const { rooms, MAX_USERS, GAME_COLORS } = require("./modules/variables");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URI,

    methods: ["GET", "POST"],
  },
});

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/image", imageRouter);
app.use("/rooms", roomsRouter);
app.use("/highscores", highScoresRouter);

io.on("connection", (socket) => {
  console.log("Någonting");

  socket.on("saveUser", (data) => {
    let name = data.name;
    console.log(data);

    socket.userColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");

    let user = {
      name: name,
      id: socket.id,
      color: socket.userColor,
    };

    console.log({ user });

    io.to(socket.id).emit("userLoggedIn", { user });
    // io.emit('userLoggedIn', {user})
  });

  // socket.emit("message", { message: "Hello from the server!" });

  // socket.emit("message", "Hello");
  // socket.on("saveUser", (arg) => {
  //   socket.userName = arg;
  //   socket.userColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

  //   let users = [];

  //   let user = {
  //     userName: socket.userName,
  //     userId: socket.id,
  //     userColor: socket.userColor,
  //   };

  //   users.push(user);
  //   console.log(users);

  //   io.emit("saveUser", { user });
  // });

  // socket.on("chat", (arg) => {
  //   socket.userMessage = arg;

  //   let chatMessage = {
  //     userColor: socket.userColor,
  //     userName: socket.userName,
  //     userMessage: socket.userMessage,
  //   };

  //   io.emit("chat", { chatMessage });
  // });

  /*****************************************************************************
   *************************** SOCKET CHAT ************************************
   *****************************************************************************/
  console.log("someone is here");

  let message = { message: "Hello world", user: "Server says" };
  socket.emit("message", message);

  socket.on("message", (arg) => {
    console.log("Incoming chat", arg);
    io.emit("message", arg);
  });

  socket.on("create room", (user) => {
    const startGrid = createEmptyGrid();
    const roomUsers = [];

    const room = {
      grid: startGrid,
      users: roomUsers,
      roomId: uuidv4(),
      colors: GAME_COLORS,
    };

    const colorIndex = Math.floor(Math.random() * room.colors.length - 1);

    const assignedColor = room.colors.splice(colorIndex, 1)[0];

    user.gameColor = assignedColor;
    user.lobbyColor = user.color;

    roomUsers.push(user);

    rooms.push(room);

    io.to(user.id).emit("create room", room);
    io.emit("monitorRooms");
  });

  socket.on("joinRoom", (userAndRoomId) => {
    const roomToJoin = rooms.find(
      (room) => room.roomId == userAndRoomId.roomId
    );

    const colorIndex = Math.floor(Math.random() * roomToJoin.colors.length - 1);

    const assignedColor = roomToJoin.colors.splice(colorIndex, 1)[0];

    userAndRoomId.user.gameColor = assignedColor;
    userAndRoomId.user.lobbyColor = userAndRoomId.user.color;

    roomToJoin.users.push(userAndRoomId.user);

    if (roomToJoin.users.length > MAX_USERS) {
      roomToJoin.isFull = true;
    }

    const usersInRoom = roomToJoin.users.map((user) => user);
    usersInRoom.forEach((user) => io.to(user.id).emit("joinRoom", roomToJoin));

    io.emit("monitorRooms");
  });

  socket.on("paint", (cellObject) => {
    const currentRoom = rooms.find((room) => room.roomId == cellObject.roomId);
    const updatedCell = updateGrid(cellObject);

    const roomIdAndUpdatedCell = {
      roomId: cellObject.roomId,
      updatedCell: updatedCell,
    };

    const usersInRoom = currentRoom.users.map((user) => user);
    usersInRoom.forEach((user) =>
      io.to(user.id).emit("paint", roomIdAndUpdatedCell)
    );
  });

  // let colors = [];

  // socket.on("addColor", (arg) => {
  //   socket.color = arg;

  //   colors.push(socket.color);

  //   console.log(colors);
  //   io.emit("updateColors", colors);
  // });

  // socket.on("removeColor", (arg) => {
  //   socket.color = arg;

  //   colors.pop(socket.color);

  //   io.emit("updateColors", colors);
  // });

  socket.on("readyCheck", (roomAndUser) => {
    const room = rooms.find((room) => room.roomId == roomAndUser.room);

    const user = room.users.find((user) => user.id == roomAndUser.user);

    // console.log(roomAndUser.user);
    // LÄGG PÅ "USER.READY = FALSE" VID LOGIN FÖR ATT ENKELT KUNNA ANVÄNDA DENNA CHECK (ready toggle)
    // if (user.ready) {
    //   user.ready = false;
    // } else {
    //   user.ready = true;
    // }

    user.ready = true;

    const allAreReady = room.users.every((user) => user.ready === true);

    const usersInRoom = room.users.map((user) => user);

    if (allAreReady) {
      room.isStarted = true;
      const solutionGrid = createSolutionGrid(room.users);

      room.solutionGrid = solutionGrid;
      room.grid = createEmptyGrid();

      let solutionGridCd = 5;
      const solutionGridInterval = setInterval(() => {
        if (solutionGridCd < 0) {
          clearInterval(solutionGridInterval);
          startGame(room);
        }
        solutionGridCd--;
      }, 1000);

      return usersInRoom.forEach((user) => {
        io.to(user.id).emit("showSolutionGrid", room);
      });
    }

    const userAndRoom = {
      user: user,
      room: room,
    };

    usersInRoom.forEach((user) =>
      io.to(user.id).emit("readyCheck", userAndRoom)
    );
    // io.emit("readyCheck", userAndRoom);
  });
});

function startGame(room) {
  const usersInRoom = room.users.map((user) => user);

  usersInRoom.forEach((user) => io.to(user.id).emit("startGame", room));

  let cd = 5;
  const gameInterval = setInterval(() => {
    if (cd < 0) {
      clearInterval(gameInterval);
      const scoreInPercent = calculateScore(room);
      room.score = scoreInPercent;
      saveScoreInDb(room.users, room.score);
      const usersInRoom = room.users.map((user) => user);
      usersInRoom.forEach((user) => io.to(user.id).emit("gameOver", room));

      const roomToRemove = rooms.find(
        (roomToFind) => roomToFind.roomId == room.roomId
      );
      const roomIndex = rooms.indexOf(roomToRemove);

      rooms.splice(roomIndex, 1);
      io.emit("monitorRooms");
    }
    cd--;
  }, 1000);
}

module.exports = { app: app, server: server };
