var express = require('express');
let router = express.Router();
var templeteController = require('./../../controller/admin/emailTempleteController');
const validation  = require('./../../validation/adminValidation');

router.route('/')
	.post(templeteController.index);

/*router.route('/create')
	.post(templeteController.add);*/
router.post('/create',validation.cms('create'),templeteController.add);

router.route('/view')
	.post(templeteController.view);

router.route('/delete')
	.post(templeteController.deleteTemplate);

router.route('/update')
	.post(templeteController.update);

router.route('/change_status')
	.post(templeteController.change_status);


module.exports = router;
		