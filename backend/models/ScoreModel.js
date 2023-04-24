const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    users: {
      type: [String],
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { collection: "scores" }
);

const ScoreModel = mongoose.model("ScoreModel", scoreSchema);

module.exports = ScoreModel;
