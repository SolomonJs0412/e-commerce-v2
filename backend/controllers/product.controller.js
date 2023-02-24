const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const Product = require("../models/product.model");
const APIFeatures = require("../utils/apiFeatures");
const errorHandler = require("../utils/errorHandler");


exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    req.body.shop = req.user.id;

    try { var product = await Product.create(req.body); }
    catch (err) {
        console.error(err);
    }

    res.status(201).json({
        success: true,
        product,
    });
})

exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const resPerPage = 10;
    const countProducts = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();

    let products = apiFeatures.query;
    let filteredProductsCount = products.length;
    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        countProducts,
        resPerPage,
        filteredProductsCount,
        products,
    });
});

exports.getProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    if (req.user.id == product.shop) {
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    }
    else if (req.user.role == "admin") {
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    }
    else {
        return next(new errorHandler("Access denied", 403));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
})