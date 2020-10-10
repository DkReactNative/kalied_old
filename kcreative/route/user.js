var express = require("express");
var router = express.Router();
const passport = require("passport");
require("./../config/passport")(passport);
var userProfileRoute = require("./user/userprofileRoute");
router.use(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userProfileRoute
);

var profileContentRoute = require("./admin/profileContentRoute");
router.use(
  "/profileContent",
  passport.authenticate("jwt", { session: false }),
  profileContentRoute
);

var findFreelancerRoute = require("./user/findFreelancerRoute");
router.use(
  "/findfreelancer",
  passport.authenticate("jwt", { session: false }),
  findFreelancerRoute
);

var paymentSettingsRoute = require("./user/paymentRoute");
router.use(
  "/payment",
  passport.authenticate("jwt", { session: false }),
  paymentSettingsRoute
);

var projectRoute = require("./user/projectRoute");
router.use(
  "/project",
  passport.authenticate("jwt", { session: false }),
  projectRoute
);

var workRoute = require("./user/jobWorkRoute");
router.use(
  "/work",
  passport.authenticate("jwt", { session: false }),
  workRoute
);

var chatRoutes = require("./chat/chatRoute");
router.use(
  "/chat",
  passport.authenticate("jwt", { session: false }),
  chatRoutes
);

module.exports = router;
