var express = require('express');
let router = express.Router();
var staticController = require('./../../controller/admin/staticPageController');

router.route('/about-us/')
	.get(staticController.about_index);

router.route('/how-it-works/')
	.get(staticController.how_it_works);
module.exports = router;
		