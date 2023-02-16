const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const Product = require("../models/product.model");
const APIFeatures = require("../utils/apiFeatures");

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
})