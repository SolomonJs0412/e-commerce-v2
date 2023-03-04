const User = require("../models/user.model");
const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const errorHandler = require("../utils/errorHandler")
const Order = require("../models/order.model");

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
exports.adminGetOrders = catchAsyncErrors(async (req, res, next) => {

    var orders = await Order.find({ user: req.params.id });

    if (!orders) {
        return next(new errorHandler(404, "No such order"));
    }

    res.status(200).json({
        success: true,
        orders
    });
});
