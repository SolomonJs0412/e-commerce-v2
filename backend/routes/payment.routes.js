const express = require("express");
const router = express.Router();

const { processPayment, sendStripApi } = require("../controllers/payment.controller");
const { isAuthenticatedUser } = require("../expressHelper/auth");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/finished").get(isAuthenticatedUser, sendStripApi);

module.exports = router;