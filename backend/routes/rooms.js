const express = require('express');
const router = express.Router();
const rooms = require('../modules/painting');

router.get('/', function(req, res) {
  res.json(rooms);
});

module.exports = router;
