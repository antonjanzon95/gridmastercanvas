const express = require('express');
const router = express.Router();
const rooms = require('../modules/variables');

router.get('/', function(req, res) {
  res.json(rooms);
});

module.exports = router;
