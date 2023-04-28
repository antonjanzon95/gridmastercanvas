const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const imageRouter = require('./routes/image');
const roomsRouter = require('./routes/rooms');
const highScoresRouter = require('./routes/highscores');

const {
  createEmptyGrid,
  updateGrid,
  createSolutionGrid,
} = require('./modules/painting');
const { calculateScore, saveScoreInDb } = require('./modules/score');
const {
  ROOMS,
  MAX_USERS,
  GAME_COLORS,
  GLOBAL_USERS,
  GAME_RUNTIME_SECONDS,
} = require('./modules/variables');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URI,

    methods: ['GET', 'POST'],
  },
});

mongoose.connect(process.env.DATABASE_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function () {
  console.log('Connected successfully');
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/image', imageRouter);
app.use('/rooms', roomsRouter);
app.use('/highscores', highScoresRouter);

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    let disconnectedUser = GLOBAL_USERS.find((user) => socket.id == user.id);

    let indexOfUser = GLOBAL_USERS.indexOf(disconnectedUser);
    GLOBAL_USERS.splice(indexOfUser, 1);
    io.emit('userDisconnect', disconnectedUser);
    io.emit('monitorGlobalUsers', GLOBAL_USERS);
  });

  socket.on('monitorGlobalUsers', (user) => {
    socket.to(user.id).emit('monitorGlobalUsers', GLOBAL_USERS);
  });

  socket.on('saveUser', (data) => {
    let name = data.name;

    socket.userColor =
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0');

    let user = {
      name: name,
      id: socket.id,
      color: socket.userColor,
      currentChat: 'global',
      ready: false,
    };

    GLOBAL_USERS.push(user);

    console.log(user.name + ' has signed in to the server');

    io.to(socket.id).emit('userLoggedIn', { user });
    io.emit('monitorGlobalUsers', GLOBAL_USERS);
  });

  socket.on('removeUser', (user) => {
    let name = user.name;

    console.log(name + ' has logged out');
    let disconnectedUser = GLOBAL_USERS.find(
      (userToFind) => userToFind.id == user.id
    );

    let indexOfUser = GLOBAL_USERS.indexOf(disconnectedUser);
    GLOBAL_USERS.splice(indexOfUser, 1);
    io.emit('userDisconnect', disconnectedUser);
    io.emit('monitorGlobalUsers', GLOBAL_USERS);
  });

  socket.on('globalMessage', (arg) => {
    io.emit('globalMessage', arg);
  });

  socket.on('localMessage', (messageAndUser) => {
    const room = ROOMS.find(
      (roomToFind) => roomToFind.roomId == messageAndUser.user.roomId
    );
    const usersInRoom = room.users.map((user) => user);

    const message = {
      user: messageAndUser.user,
      message: messageAndUser.message,
      color: messageAndUser.user.color,
    };

    room.messages.unshift(message);

    usersInRoom.forEach((user) =>
      io.to(user.id).emit('monitorRoomMessages', room)
    );
  });

  socket.on('create room', (user) => {
    const startGrid = createEmptyGrid();
    const roomUsers = [];

    const room = {
      grid: startGrid,
      users: roomUsers,
      roomId: uuidv4(),
      colors: GAME_COLORS,
      messages: [],
    };

    const colorIndex = Math.floor(Math.random() * room.colors.length - 1);

    const assignedColor = room.colors.splice(colorIndex, 1)[0];

    user.gameColor = assignedColor;
    user.lobbyColor = user.color;

    roomUsers.push(user);

    ROOMS.push(room);

    io.to(user.id).emit('create room', room);
    io.emit('monitorRooms');
  });

  socket.on('joinRoom', (userAndRoomId) => {
    const roomToJoin = ROOMS.find(
      (room) => room.roomId == userAndRoomId.roomId
    );

    const colorIndex = Math.floor(Math.random() * roomToJoin.colors.length - 1);

    const assignedColor = roomToJoin.colors.splice(colorIndex, 1)[0];

    userAndRoomId.user.gameColor = assignedColor;
    userAndRoomId.user.lobbyColor = userAndRoomId.user.color;

    roomToJoin.users.push(userAndRoomId.user);

    if (roomToJoin.users.length == MAX_USERS) {
      roomToJoin.isFull = true;
    }

    const usersInRoom = roomToJoin.users.map((user) => user);
    usersInRoom.forEach((user) => io.to(user.id).emit('joinRoom', roomToJoin));

    console.log(usersInRoom);

    io.emit('monitorRooms');
  });

  socket.on('paint', (cellObject) => {
    const currentRoom = ROOMS.find((room) => room.roomId == cellObject.roomId);
    const updatedCell = updateGrid(cellObject);

    const roomIdAndUpdatedCell = {
      roomId: cellObject.roomId,
      updatedCell: updatedCell,
    };

    const usersInRoom = currentRoom.users.map((user) => user);
    usersInRoom.forEach((user) =>
      io.to(user.id).emit('paint', roomIdAndUpdatedCell)
    );
  });

  socket.on('readyCheck', (roomAndUser) => {
    const room = ROOMS.find((room) => room.roomId == roomAndUser.room);

    const user = room.users.find((user) => user.id == roomAndUser.user);

    if (user.ready) {
      user.ready = false;
    } else {
      user.ready = true;
    }

    const allAreReady = room.users.every((user) => user.ready === true);

    const usersInRoom = room.users.map((user) => user);

    if (allAreReady) {
      room.isStarted = true;
      io.emit('monitorRooms');
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
        io.to(user.id).emit('showSolutionGrid', room);
      });
    }

    const userAndRoom = {
      user: user,
      room: room,
    };

    usersInRoom.forEach((user) =>
      io.to(user.id).emit('readyCheck', userAndRoom)
    );
  });

  socket.on('leaveRoom', (user) => {
    const room = ROOMS.find((room) => room.roomId == user.roomId);

    const userToRemove = room.users.find(
      (userToFind) => userToFind.id == user.id
    );
    const userIndex = room.users.indexOf(userToRemove);

    room.colors.push(userToRemove.gameColor);

    room.users.splice(userIndex, 1);

    if (room.users.length == MAX_USERS - 1) {
      room.isFull = false;
    }

    if (room.users.length == 0) {
      const roomIndex = ROOMS.indexOf(room);

      ROOMS.splice(roomIndex, 1);

      return io.emit('monitorRooms');
    } else {
      const message = {
        user: { name: 'Gridmaster Bot' },
        message: userToRemove.name + ' has left the room.',
        color: 'red',
      };

      room.messages.unshift(message);

      const usersInRoom = room.users.map((user) => user);

      usersInRoom.forEach((user) => io.to(user.id).emit('leaveRoom', room));

      io.emit('monitorRooms');
    }
  });
});

function startGame(room) {
  const usersInRoom = room.users.map((user) => user);

  usersInRoom.forEach((user) => io.to(user.id).emit('startGame', room));

  let cd = GAME_RUNTIME_SECONDS;
  const gameInterval = setInterval(() => {
    usersInRoom.forEach((user) =>
      io.to(user.id).emit('gameCountdownTimer', cd)
    );

    if (cd < 0) {
      clearInterval(gameInterval);
      const scoreInPercent = calculateScore(room);
      room.score = scoreInPercent;
      saveScoreInDb(room.users, room.score);
      const usersInRoom = room.users.map((user) => user);
      usersInRoom.forEach((user) => io.to(user.id).emit('gameOver', room));
    }
    cd--;
  }, 1000);
}

module.exports = { app: app, server: server };
