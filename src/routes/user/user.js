var express = require('express');
var router = express.Router();
const UserController = require('../../controllers/UserController');
const AuthorizationController = require('../../controllers/AuthorizationController');

router.get('/get_user_by_account_number/:accountNumber', AuthorizationController.check_token, UserController.get_user_by_account_number);
router.get('/get_user_by_identity_number/:identityNumber', AuthorizationController.check_token, UserController.get_user_by_identity_number);
router.post('/add_user', AuthorizationController.check_token, UserController.add_user);
router.put('/update_user', AuthorizationController.check_token, UserController.update_user);
router.delete('/delete_user', AuthorizationController.check_token, UserController.delete_user);

module.exports = router;