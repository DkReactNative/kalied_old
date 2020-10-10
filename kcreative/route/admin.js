var express = require("express");
var router = express.Router();
const passport = require("passport");
require("./../config/passport")(passport);

/** admin user Routing Start **/
var userRoutes = require("./admin/userRoute");
router.use("/", userRoutes);
/** admin user Routing End **/

/** CMS Pages Routing Start **/
var cmspageRoutes = require("./admin/cmsRoute");
router.use(
  "/cmspage",
  passport.authenticate("jwt", { session: false }),
  cmspageRoutes
);
/** CMS Pages Routing End **/

/** Email Template Routing Start **/
var emailtemplateRoutes = require("./admin/emailTempleteRoute");
router.use(
  "/emailtemplate",
  passport.authenticate("jwt", { session: false }),
  emailtemplateRoutes
);
/** Email Template Routing End **/

/** Email Template Routing Start **/
var globalSettingRoute = require("./admin/globalSettingRoute");
router.use(
  "/config",
  passport.authenticate("jwt", { session: false }),
  globalSettingRoute
);
/** Email Template Routing End **/

/** Email Template Routing Start **/
var userManageRoute = require("./admin/userManageRoute");
router.use(
  "/userManage",
  passport.authenticate("jwt", { session: false }),
  userManageRoute
);
/** Email Template Routing End **/

/** Project Management Routing Start **/
var projectManageRoute = require("./admin/projectManageRoute");
router.use(
  "/projectManage",
  passport.authenticate("jwt", { session: false }),
  projectManageRoute
);
/** Project Management Routing End **/

var staticPageRoute = require("./admin/staticPageRoute");
router.use(
  "/staticpage",
  passport.authenticate("jwt", { session: false }),
  staticPageRoute
);

var homeSliderContentRoute = require("./admin/homeSliderContentRoute");
router.use(
  "/homeslider",
  passport.authenticate("jwt", { session: false }),
  homeSliderContentRoute
);

var profileContentRoute = require("./admin/profileContentRoute");
router.use(
  "/profileContent",
  passport.authenticate("jwt", { session: false }),
  profileContentRoute
);

/** Admin Global Settings Routes End **/

module.exports = router;
