var express = require("express");
var router = express.Router();
const user = require("./user");

router.use(user);

module.exports = router;