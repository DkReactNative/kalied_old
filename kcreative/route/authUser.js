var express = require('express');
var router = express.Router();

/** user authenticate Start **/
var userRoutes = require('./user/userRoute');
router.use('/', userRoutes);
/** user authenticate End **/

var getCmsPageData = require('./user/cmsPageRoute')
router.use('/cms', getCmsPageData)

var globalSettingRoute = require('./user/globalSettingRoute');
router.use('/config', globalSettingRoute);

var staticPageRoute = require('./admin/staticPageRoute');
router.use('/staticpage', staticPageRoute);

var homeSliderContentRoute = require('./user/homeSliderContentRoute');
router.use('/homeslider', homeSliderContentRoute);

var findFreelancerRoute = require('./user/findFreelancerRoute');
router.use('/findfreelancer-auth', findFreelancerRoute);

var profileContentRoute = require('./admin/profileContentRoute');
router.use('/profileContent-auth', profileContentRoute);

var workRoute = require('./user/jobWorkRoute');
router.use('/work-auth', workRoute);

module.exports = router
