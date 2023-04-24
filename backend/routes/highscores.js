var express = require("express");
const ScoreModel = require("../models/ScoreModel");
var router = express.Router();

router.get("/", async (req, res) => {
  const highscores = await ScoreModel.find();

  res.status(200).json(highscores);
});

module.exports = router;
