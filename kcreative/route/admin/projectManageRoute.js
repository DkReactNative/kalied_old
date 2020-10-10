var express = require("express");
var router = express.Router();
var projectManageController = require("../../controller/admin/projectManageController");

router.route("/list/:page").post(projectManageController.list);

router.route("/view/:id").get(projectManageController.view);

module.exports = router;
