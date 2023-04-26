var express = require('express');
var router = express.Router();
const { GLOBAL_USERS } = require("../modules/variables");

/* GET users listing. */
router.get('/', function(req, res) {
  res.json(GLOBAL_USERS);
});

module.exports = router;
