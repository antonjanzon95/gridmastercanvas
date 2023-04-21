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
const { createEmptyGrid, rooms, updateGrid } = require("./modules/painting");

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

io.on("connection", (socket) => {
  console.log("Någonting");
  socket.on("saveUser", (arg) => {
    socket.userName = arg;
    socket.userColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    let user = {
      userName: socket.userName,
      userId: socket.id,
      userColor: socket.userColor,
    };

    console.log({ user });
    io.emit("saveUser", { user });
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

  socket.emit("message", { message: "Hello world", user: "Server says" });

  socket.on("message", (arg) => {
    console.log("Incoming chat", arg);
    io.emit("message", arg);
  });

  socket.on("create room", (user) => {
    const startGrid = createEmptyGrid();
    const roomUsers = [];

    roomUsers.push(user);

    const room = {
      grid: startGrid,
      users: roomUsers,
      roomId: uuidv4(),
    };

    rooms.push(room);

    io.emit("create room", room);
  });

  socket.on("join room", (userAndRoomId) => {
    const roomToJoin = rooms.find(
      (room) => room.roomId == userAndRoomId.roomId
    );

    if (roomToJoin.users.length % 2 == 0) {
      userAndRoomId.user.color = "green";
    }

    roomToJoin.users.push(userAndRoomId.user);

    io.emit("join room", roomToJoin);
  });

  socket.on("paint", (cellObject) => {
    // {roomId: room.roomId, cellId: e.target.id, color: user.color});
    const updatedCell = updateGrid(cellObject);
    io.emit("paint", updatedCell);
  });

  let colors = [];

  socket.on("addColor", (arg) => {
    socket.color = arg;

    colors.push(socket.color);

    console.log(colors);
    io.emit("updateColors", colors);
  });

  socket.on("removeColor", (arg) => {
    socket.color = arg;

    colors.pop(socket.color);

    io.emit("updateColors", colors);
  });
});

module.exports = { app: app, server: server };
