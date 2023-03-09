const User = require("../models/user.model");
const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const errorHandler = require("../utils/errorHandler")
const Order = require("../models/order.model");
const Product = require("../models/product.model");

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

exports.getUserDetailsById = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new errorHandler(`User not found with ID: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new errorHandler(`User not found with ID: ${req.params.id}`));
    }

    await user.remove();

    res.status(200).json({
        success: true,
        user,
    });
});

//admin get orders
exports.adminGetOrder = catchAsyncErrors(async (req, res, next) => {

    var orders = await Order.find({ user: req.params.id });

    if (!orders) {
        return next(new errorHandler(404, "No such order"));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

exports.getAllOrder = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === "Delivered") {
        return next(new errorHandler("You have already delivered this order"), 400);
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
        order,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false });
}

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new errorHandler("no order found with this id ", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
        order,
    });
});