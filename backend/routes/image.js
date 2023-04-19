var express = require("express");
const ImageModel = require("../models/ImageModel");
const StringModel = require("../models/StringModel");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/save", async function (req, res) {
  const { user, image } = req.body;

  const toSend = { user: user.name, image: image };

  const saveImage = new ImageModel(toSend);

  await saveImage.save();

  res.status(201).json({ message: "Image saved!" });
});

router.post("/savestr", async function (req, res) {
  const saveStr = await StringModel.create(req.body);

  console.log(saveStr);

  res.status(201).json(saveStr);
});

module.exports = router;
