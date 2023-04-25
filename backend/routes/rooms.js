const express = require("express");
const router = express.Router();
const { rooms } = require("../modules/variables");

router.get("/", function (req, res) {
  res.json(rooms);
});

router.get("/messages/:roomId", function (req, res) {
  const roomId = req.params.roomId;
  const room = rooms.find((room) => room.roomId == roomId);

  console.log(room.messages);
  res.json(room.messages);
});

module.exports = router;
