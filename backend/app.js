const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const imageRouter = require("./routes/image");
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

io.on("connection", (socket) => {
  // console.log("Någonting");
  // socket.emit("message", { message: "Hello from the server!" });

  socket.emit("message", "Hello");
  socket.on("saveUser", (arg) => {
    socket.userName = arg;
    socket.userColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    let users = [];

    let user = {
      userName: socket.userName,
      userId: socket.id,
      userColor: socket.userColor,
    };

    users.push(user);
    console.log(users);

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

  socket.on("hej", (arg) => {
    console.log(arg);
    io.emit("hej", arg + " Anton");

    io.emit("hejhej", arg + " Anton");
  });
});

module.exports = { app: app, server: server };
