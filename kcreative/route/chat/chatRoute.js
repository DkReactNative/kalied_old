var express = require("express");
let router = express.Router();
var chatController = require("../../controller/chat/chatController");

router.route("/createRoom").post(chatController.createRoom);

router.route("/getRoom").get(chatController.getRoom);

router.route("/getRoomAndMessages").post(chatController.getRoomAndMessage);

router
  .route("/getInvitedFreelancers/:project_id")
  .get(chatController.getInvitedFreelancers);

module.exports = router;
