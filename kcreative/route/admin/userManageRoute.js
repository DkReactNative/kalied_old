var express = require('express');
let router = express.Router();
var userManageController = require('../../controller/admin/userManageController');


router.route('/:id')
    .get(userManageController.view);

router.route('/')
    .post(userManageController.create);
router.route('/search')
    .post(userManageController.index);
router.route('/changStatus')
    .post(userManageController.changeStatus);
router.route('/:id')
    .put(userManageController.update);
router.route('/:id')
    .delete(userManageController.remove);
router.route('/approve')
    .post(userManageController.approve);

    // portfolio management
router.route('/portfolio/:id')
    .get(userManageController.portfolioView);
router.route('/portfolio/')
    .post(userManageController.portfolioIndex);
router.route('/portfolio/:id')
    .delete(userManageController.portfolioRemove);
router.route('/portfolio/update')
    .post(userManageController.portfolioUpdate);  
router.route('/portfolio/changStatus')
    .post(userManageController.portfolioChangeStatus);      

module.exports = router;