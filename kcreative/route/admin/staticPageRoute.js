var express = require('express');
let router = express.Router();
var staticController = require('./../../controller/admin/staticPageController');

router.route('/about-us/')
	.get(staticController.about_index);

router.route('/about-us/')
	.post(staticController.about_update);
router.route('/contact-us/')
	.get(staticController.contact_index);

router.route('/contact-us/')
	.post(staticController.contact_update);

router.route('/faq/:page')
	.get(staticController.faq_index);

router.route('/faq/')
	.post(staticController.faq_create);
router.route('/faq/:id')
	.put(staticController.faq_update);

router.route('/faq/:id')
	.delete(staticController.faq_delete);
router.route('/faq/view/:id')
	.get(staticController.faq_view);

router.route('/how-it-works/')
	.get(staticController.how_it_works);

router.route('/how-it-works/')
	.post(staticController.how_it_works_update);
module.exports = router;
		