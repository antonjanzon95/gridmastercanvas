var express = require("express");
const ImageModel = require("../models/ImageModel");
var router = express.Router();

router.post("/save", async function (req, res) {
  const { user, image } = req.body;

  const toSend = { user: user.name, image: image };

  console.log(toSend);

  const saveImage = await ImageModel.create(toSend);

  res.status(201).json({ message: "Image saved!" });
});

router.get("/", async function (req, res) {
  const imgs = await ImageModel.find();

  res.status(200).json(imgs);
});

module.exports = router;
