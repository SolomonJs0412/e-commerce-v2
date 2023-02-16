const express = require("express");
const router = express.Router();

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct } = require("../controllers/product.controller");

router.route("/products").get(getProducts);
router.route("/product/:id").get(getProduct).delete(deleteProduct).put(updateProduct);
router.route("/product/new").post(createProduct);
module.exports = router;