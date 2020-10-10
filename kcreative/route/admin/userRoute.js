var express = require('express');
let router = express.Router();
const userController = require('../../controller/admin/userController');
const validation  = require('./../../validation/adminValidation');
const {validationResult} = require('express-validator');


/*router.route('/login')
	.post(userController.login);*/

router.post('/login',userController.login)

router.route('/forgot_password')
	.post(userController.forget_password);

router.route('/verifyOTP')
	.post(userController.verify_otp);

router.route('/reset_password')
	.post(userController.reset_password);
router.route('/update_password')
	.post(userController.change_password);

router.route('/update_profile')
	.post(userController.update_profile);
	

module.exports = router;
		