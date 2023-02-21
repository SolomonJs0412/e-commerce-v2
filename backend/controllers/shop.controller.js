const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const Shop = require("../models/shop.model");
const Product = require("../models/product.model");
const APIFeatures = require("../utils/apiFeatures");
const errorHandler = require("../utils/errorHandler");

const { createProduct } = require("./product.controller");

exports.newShop = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
    const shop = await Shop.create(req.body);

    res.status(201).json({
        success: true,
        shop
    });
});

exports.addNewProduct = catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
        return next(new errorHandler("Not found shop", 404));
    }

    const product = Product.create(req.body);

    const productId = await Product.findOne().sort({ _id: -1 }).exec();
    shop.products.push(productId);
    shop.save(function (err) {
        if (err) {
            return err;
        }
    });

    res.status(201).json({
        success: true,
        productId
    })
});