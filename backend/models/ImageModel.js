const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    users: {
      type: [{ id: String, name: String, color: String }],
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
