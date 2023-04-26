const express = require("express");
const router = express.Router();
const { ROOMS } = require("../modules/variables");

router.get("/", function (req, res) {
  res.json(ROOMS);
});

router.get("/messages/:roomId", function (req, res) {
  const roomId = req.params.roomId;
  const room = ROOMS.find((room) => room.roomId == roomId);

  res.json(room.messages);
});

module.exports = router;
