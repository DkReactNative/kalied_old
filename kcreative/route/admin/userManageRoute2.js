var express = require('express');
let router = express.Router();
var userController = require('./../../controller/user/userController');

router.route('/create')
    .post(userController.register);
router.route('/view/:id')
    .get(userController.view);

router.route('/')
    .post(userController.index);

/*router.route('/create')
	.post(cmsController.add);

router.route('/view')
	.post(cmsController.view);

router.route('/delete')
	.post(cmsController.destroy);

router.route('/change_status')
	.post(cmsController.change_status);

router.route('/update')
	.post(cmsController.update);*/

module.exports = router;