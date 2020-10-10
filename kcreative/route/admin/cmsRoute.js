var express = require('express');
let router = express.Router();
var cmsController = require('./../../controller/admin/cmsController');

router.route('/')
	.post(cmsController.index);

router.route('/create')
	.post(cmsController.add);

router.route('/view')
	.post(cmsController.view);

router.route('/delete')
	.post(cmsController.destroy);

router.route('/change_status')
	.post(cmsController.change_status);

router.route('/update')
	.post(cmsController.update);

module.exports = router;
		