const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const errorHandler = require("../utils/errorHandler");

//for admin
exports.createCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.create(req.body);

    res.status(201).json({
        success: true,
        category,
    });
})

exports.getCategories = catchAsyncErrors(async (req, res, next) => {
    const categories = await Category.find({});
    const countOfCategory = await Category.countDocuments();
    if (!categories) {
        return next(new errorHandler("There're no valid category", 404));
    }

    res.status(200).json({
        success: true,
        countOfCategory,
        categories
    });
})

exports.getCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new errorHandler("There're no valid category", 404));
    }

    res.status(200).json({
        success: true,
        category
    });
})

exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    let category = await Category.findById(req.params.id);

    if (!category) {
        return next(new errorHandler("Category not found", 404));
    }

    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        category,
    });
});

exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new errorHandler("Category not found", 404));
    }

    await category.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
})