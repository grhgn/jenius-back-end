var express = require("express");
var router = express.Router();
const token = require("./token");

router.use(token);

module.exports = router;