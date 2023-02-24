const jwt = require("jsonwebtoken");

const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const Shop = require("../models/shop.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");
const APIFeatures = require("../utils/apiFeatures");
const errorHandler = require("../utils/errorHandler");

exports.newShop = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;

    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    const shop = await Shop.create(req.body);
    const shopId = await Shop.findOne().sort({ _id: -1 }).exec();

    if (user.shop.isCreated === false) {
        user.shop.shop = shopId;
        user.shop.isCreated = true;
        user.save();
    } else {
        return next(new errorHandler("you have a shop", 403));
    }

    res.status(201).json({
        success: true,
        shop
    });
});

exports.addNewProduct = catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);

    const { token } = req.cookies;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user.id != shop.user) {
        return next(new errorHandler("you not a owner", 403));
    }
    req.body.shop = req.user.id;
    const product = await Product.create(req.body);

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

exports.getAllShopProducts = catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);

    const listProducts = shop.products;
    const countOfProducts = listProducts.length;

    res.status(201).json({
        success: true,
        listProducts,
        countOfProducts
    })
});

exports.getShopInfo = catchAsyncErrors(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
        return next(new errorHandler("Not found valid shop", 404));
    }

    res.status(200).json({
        success: true,
        shop
    })
});

exports.updateShop = catchAsyncErrors(async (req, res, next) => {
    let shop = await Shop.findById(req.params.id);
    if (!shop) {
        return next(new errorHandler("Not found valid shop", 404));
    }

    if (req.user.id == shop.user) {
        shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    }
    else if (req.user.role == "admin") {
        shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
    }
    else {
        return next(new errorHandler(" You have not permission to access this resource"));
    }

    res.status(200).json({
        success: true,
        message: "Shop has been update",
        shop
    });
});

exports.deleteShop = catchAsyncErrors(async (req, res, next) => {
    let shop = await Shop.findById(req.params.id);
    const user = await User.findById(req.user.id);
    if (!shop) {
        return next(new errorHandler("Not found valid shop", 404));
    }

    if (req.user.id == shop.user) {
        user.shop.isCreated = false;
        user.save();
        shop.remove();
    }
    else if (req.user.role == "admin") {
        user.shop.isCreated = false;
        user.save();
        shop.remove();
    }
    else {
        return next(new errorHandler("you not a owner", 403));
    }

    res.status(200).json({
        success: true,
        message: "Shop deleted successfully",
    })
});