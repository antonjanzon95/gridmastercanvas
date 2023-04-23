var express = require("express");
const ScoreModel = require("../models/ScoreModel");
var router = express.Router();

router.get("/", async (req, res) => {
  const highscores = await ScoreModel.find();

  res.status(200).json(highscores);
});

router.post("/", async (req, res) => {
  const toSave = { ...req.body, date: new Date() };

  const save = await ScoreModel.create(toSave);

  res.status(201).json({ message: "Highscore saved!" });
});

module.exports = router;
