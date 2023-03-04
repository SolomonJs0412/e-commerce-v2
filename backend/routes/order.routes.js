const express = require("express");
const router = express.Router();

const { newOrder,
    getSingleOrder,
    myOrders } = require("../controllers/order.controller")
const { isAuthenticatedUser } = require("../expressHelper/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/me/orders").get(isAuthenticatedUser, myOrders);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

module.exports = router;