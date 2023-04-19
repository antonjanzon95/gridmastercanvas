var express = require("express");
const ImageModel = require("../models/ImageModel");
var router = express.Router();

router.get("/", async function (req, res) {
  const imgs = await ImageModel.find();

  res.status(200).json(imgs);
});

router.get("/:id", async function (req, res) {
  const id = req.params.id;
  // const objectId = new
  const img = await ImageModel.findOne({ _id: id });

  res.status(200).json(img);
});

router.post("/save", async function (req, res) {
  const { user, image } = req.body;

  const toSend = { user: user.name, image: image };

  console.log(toSend);

  const saveImage = await ImageModel.create(toSend);

  res.status(201).json({ message: "Image saved!" });
});

module.exports = router;
