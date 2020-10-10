var express = require("express");
let router = express.Router();
const paymentController = require("../../controller/user/paymentSettingsController");

router.get("/getCardDetails", paymentController.index);

router.get("/getToken", paymentController.getToken);

router.post("/addcard", paymentController.addcard);

router.post("/addCardReference", paymentController.addCardReference);

router.post("/setdefaultCard", paymentController.setdefaultCard);

router.post("/makePayment", paymentController.makePayment);

router.get(
  "/getPendingPaymentProjects",
  paymentController.getPendingPaymentProjects
);

router.get("/getDefaultCard", paymentController.getDefaultCard);

module.exports = router;
