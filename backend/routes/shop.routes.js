const express = require("express");
const router = express.Router();

const {
    newShop,
    addNewProduct } = require("../controllers/shop.controller");
const { isAuthenticatedUser } = require("../expressHelper/auth");

router.route("/shop/new").post(isAuthenticatedUser, newShop);
router.route("/shop/:id/product/new").post(isAuthenticatedUser, addNewProduct);

module.exports = router;