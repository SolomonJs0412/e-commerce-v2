const User = require("../models/user.model");
const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");

exports.showAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
})