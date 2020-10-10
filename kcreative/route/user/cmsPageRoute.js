var express = require('express');
let router = express.Router();
var cmsController = require('./../../controller/user/cmsController');

router.route('/')
	.post(cmsController.index);
module.exports = router;
		
