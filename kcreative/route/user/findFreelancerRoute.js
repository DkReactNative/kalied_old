var express = require('express');
let router = express.Router();
const userController = require('../../controller/user/findFreelancerController' );

router.route('/').post(userController.index)

router.route('/favouriteTabList')
    .post(userController.favouriteTabIndex);

router.route('/favourateAddUser').post(userController.favourateAddUser)

router.route('/favourateRemoveUser').post(userController.favourateRemoveUser)

router.route('/favourateListAdd')
    .post(userController.favourateListAdd);

router.route('/favourateUser').post(userController.favourateUser)

router.route('/hiddenListAdd')
    .post(userController.hiddenListAdd); 

router.route('/hiddenListRemove')
    .post(userController.hiddenListRemove); 

router.route('/hidenList')
    .post(userController.hidenListIndex);

router.route('/past-clients')
    .get(userController.pastClients);

router.route('/addNote')
    .post(userController.addnote); 
router.route('/freelancer-profile')
    .post(userController.freelancerProfile); 

module.exports = router;
