const User = require("../models/user.model");
const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const errorHandler = require("../utils/errorHandler")

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
