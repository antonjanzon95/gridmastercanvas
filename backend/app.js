const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const imageRouter = require("./routes/image");
const roomsRouter = require("./routes/rooms");
const { createEmptyGrid, rooms, updateGrid } = require("./modules/painting");
// const { MongoClient } = require("mongodb");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",

    methods: ["GET", "POST"],
  },
});

mongoose.connect(
  "mongodb+srv://antonjanzon123:antonjanzon123@test-cluster.cq7iazz.mongodb.net/gridmastercanvas",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

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

  socket.on("chat", (arg) => {
    socket.userMessage = arg;

    let chatMessage = {
      userColor: socket.userColor,
      userName: socket.userName,
      userMessage: socket.userMessage,
    };

    io.emit("chat", { chatMessage });
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

  socket.on("paint", (cellObject) => {
    // {roomId: room.roomId, cellId: e.target.id, color: user.color});
    const updatedCell = updateGrid(cellObject);
    io.emit("paint", updatedCell);
  });
});

module.exports = { app: app, server: server };
