var express = require("express");
const ScoreModel = require("../models/ScoreModel");
var router = express.Router();

router.get("/", async (req, res) => {
  const highscores = await ScoreModel.find();

  res.status(200).json(highscores);
});

// router.post("/save", async (req, res) => {
//   const { users, score } = req.body;
//   const userNames = users.map((user) => user.name);
//   const toSave = { users: userNames, score: score, date: new Date() };

//   const save = await ScoreModel.create(toSave);

//   res.status(201).json({ message: "Highscore saved!" });
// });

module.exports = router;
