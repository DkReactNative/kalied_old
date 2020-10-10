var express = require('express');
let router = express.Router();
const userController = require('../../controller/user/userController');

router.post('/login', userController.login)
router.post('/register', userController.register)

router.route('/forgot-password')
    .post(userController.forgetPassword);

router.route('/verifyOTP')
    .post(userController.verifyOtp);

router.route('/reset-password')
    .post(userController.resetPassword);
router.route('/update-password')
    .post(userController.changePassword);

router.route('/update-profile')
    .post(userController.updateProfile);

router.route('/resendOtp')
    .post(userController.resendOtp);

router.post('/updateGeoLocation', userController.updateGeoLocation)


module.exports = router;