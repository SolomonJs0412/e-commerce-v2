const express = require("express");
const router = express.Router();

const {
    newShop,
    addNewProduct,
    getAllShopProducts,
    getShopInfo,
    deleteShop,
    updateShop } = require("../controllers/shop.controller");
const { isAuthenticatedUser } = require("../expressHelper/auth");

router.route("/shop/new").post(isAuthenticatedUser, newShop);
router.route("/shop/:id/product/new").post(isAuthenticatedUser, addNewProduct);
router.route("/shop/:id/products").get(isAuthenticatedUser, getAllShopProducts);
router.route("/shop/:id").get(getShopInfo).put(isAuthenticatedUser, updateShop).delete(isAuthenticatedUser, deleteShop);

module.exports = router;