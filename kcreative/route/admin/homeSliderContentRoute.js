var express = require('express');
let router = express.Router();
var homeSlideContent = require('./../../controller/admin/homeSlideContentController');
router.route('/creative/:page')
	.get(homeSlideContent.creative_index);

router.route('/creative/')
	.post(homeSlideContent.creative_create);
	
router.route('/creative/update')
	.post(homeSlideContent.creative_update);

router.route('/creative/:id')
	.delete(homeSlideContent.creative_delete);

router.route('/creative/view/:id')
	.get(homeSlideContent.creative_view);

router.route('/toptier/:page')
	.get(homeSlideContent.toptier_index);

router.route('/toptier/')
	.post(homeSlideContent.toptier_create);

router.route('/toptier/update')
	.post(homeSlideContent.toptier_update);

router.route('/toptier/:id')
	.delete(homeSlideContent.toptier_delete);

router.route('/toptier/view/:id')
	.get(homeSlideContent.toptier_view);

module.exports = router;
		