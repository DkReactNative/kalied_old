var express = require('express');
let router = express.Router();
const globalSettingController = require('../../controller/admin/globalSettingController');


router.route('/')
	.post(globalSettingController.list);
module.exports = router;
		