const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    image: {
      type: [{ color: String }],
      required: true,
    },
  },
  { collection: "images" }
);

const ImageModel = mongoose.model("ImageModel", imageSchema);

module.exports = ImageModel;
