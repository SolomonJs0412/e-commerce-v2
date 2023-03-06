const Order = require("../models/order.model")
const catchAsyncErrors = require("../expressHelper/catchAsyncErrors")
const ErrorHandler = require("../utils/errorHandler")

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    });
    res.status(200).json({
        success: true,
        order,
    });
});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {

    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
    const order = await Order.findById(req.params.id)

    if (order.user != req.user.id) {
        return next(new ErrorHandler("Not have not permission to access this resource", 403));
    }

    if (!order) {
        return next(new ErrorHandler("no order found with this id ", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
    const orders = await Order.find({ user: req.user.id });

    if (!orders) {
        return next(new ErrorHandler("no orders found with this id ", 404));
    }

    res.status(200).json({
        success: true,
        orders,
    });
});

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("no order found with this id ", 404));
    }

    await order.remove();

    res.status(200).json({
        success: true,
        order,
    });
});