let ROOMS = [];
let GLOBAL_USERS = [];

const GAME_RUNTIME_SECONDS = 5;

const GAME_COLORS = [
  "red",
  "blue",
  "green",
  // "yellow",
  // "purple",
  // "black",
  // "pink",
  // "teal",
  // "orange",
  // "gold",
];

const MAX_USERS = GAME_COLORS.length;

module.exports = { ROOMS, GAME_COLORS, MAX_USERS, GLOBAL_USERS, GAME_RUNTIME_SECONDS };
