var express = require('express');
let router = express.Router();
const globalSettingController = require('../../controller/admin/globalSettingController');


router.route('/')
	.post(globalSettingController.list);

router.route('/update')
	.post(globalSettingController.update);
	
router.route('/create')
	.post(globalSettingController.create);
// router.route('/delete')
// 	.post(globalSettingController.delete);



module.exports = router;
		