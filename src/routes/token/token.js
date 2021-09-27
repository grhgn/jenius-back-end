var express = require('express');
var router = express.Router();
const AuthorizationController = require('../../controllers/AuthorizationController');

router.get('/generate_token', AuthorizationController.generate_token);

module.exports = router;