var express = require('express');
let router = express.Router();
var homeSlideContent = require('./../../controller/admin/homeSlideContentController');
router.route('/creative/:page')
	.get(homeSlideContent.creative_index);
router.route('/toptier/:page')
	.get(homeSlideContent.toptier_index);
module.exports = router;
		