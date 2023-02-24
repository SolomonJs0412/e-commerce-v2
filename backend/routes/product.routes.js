const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct } = require("../controllers/product.controller");

const { isAuthenticatedUser } = require("../expressHelper/auth");


router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct).delete(isAuthenticatedUser, deleteProduct).put(isAuthenticatedUser, updateProduct);
router.route("/product/new").post(isAuthenticatedUser, createProduct);
module.exports = router;