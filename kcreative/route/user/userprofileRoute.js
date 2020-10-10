var express = require('express');
let router = express.Router();
const userController = require('../../controller/user/userprofileController');

router.get('/:id', userController.index)

router.route('/change-password')
    .post(userController.changePassword);

router.route('/update-clientprofile')
    .post(userController.updateProfileClient);

router.route('/notification-setting')
    .post(userController.updateNotification);

router.route('/update-step1')
    .post(userController.updateStep1);

router.get('/step1-info/:id', userController.Step1info)

router.route('/update-step2')
    .post(userController.updateStep2);

router.get('/step2-info/:id', userController.Step2info)

router.route('/update-step3')
    .post(userController.updateStep3);

router.get('/step3-info/:id', userController.Step3info)

router.route('/update-step4')
    .post(userController.updateStep4);

router.get('/step4-info/:id', userController.Step4info)

router.route('/update-step5')
    .post(userController.updateStep5);

router.route('/update-image')
    .post(userController.updateProfileImage);

router.get('/step5-info/:id', userController.Step5info);

router.route('/update-portofolio')
    .post(userController.updatePortfolio);

router.route('/remove-portofolio')
    .post(userController.removePortfolio);

module.exports = router;