const mongoose = require("mongoose");

const stringSchema = mongoose.Schema(
  {
    minstring: String,
  },
  { collection: "images" }
);

const StringModel = mongoose.model("StringModel", stringSchema);

module.exports = StringModel;
