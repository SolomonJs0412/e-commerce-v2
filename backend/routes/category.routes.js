const express = require("express");
const router = express.Router();

const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory } = require("../controllers/category.controller");

router.route("/categories").get(getCategories);
router.route("/category/new").post(createCategory);
router.route("/category/:id").get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;