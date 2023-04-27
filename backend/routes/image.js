var express = require('express');
const ImageModel = require('../models/ImageModel');
var router = express.Router();
const { ROOMS } = require('../modules/variables');

router.get('/', async function (req, res) {
  const imgs = await ImageModel.find();

  res.status(200).json(imgs);
});

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  // const objectId = new
  const img = await ImageModel.findOne({ _id: id });

  res.status(200).json(img);
});

router.post('/save', async function (req, res) {
  const { id } = req.body;

  const currentRoom = ROOMS.find((room) => room.id == id);

  const toSave = { users: currentRoom.users, image: currentRoom.grid };

  const saveImage = await ImageModel.create(toSave);

  res.status(201).json({ message: 'Image saved!' });
});

module.exports = router;
