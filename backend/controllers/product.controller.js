const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const Product = require("../models/product.model");
const APIFeatures = require("../utils/apiFeatures");
const errorHandler = require("../utils/errorHandler");


exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
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
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
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
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
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
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
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
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new errorHandler("Product not found", 404));
    }

    if (req.user.id == product.shop) {
        await product.remove();
    }
    else if (req.user.role == "admin") {
        await product.remove();
    }
    else {
        return next(new errorHandler("Access denied", 403));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
})