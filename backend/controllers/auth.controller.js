const crypto = require("crypto");

const errorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../expressHelper/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendMail");
const User = require("../models/user.model");

exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password, avatar } = req.body;
    const user = await User.create({
        name,
        email,
        password
    });
    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorHandler("Please enter your email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new errorHandler("Invalid information", 401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new errorHandler("Invalid password", 401));
    }
    sendToken(user, 200, res);
})

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

exports.getUserInfo = catchAsyncErrors(async (req, res, next) => {
    console.info(`[${new Date().toLocaleString()}] Incoming ${req.method}${req.originalUrl} request from ${req.rawHeaders[0]}${req.rawHeaders[1]}`);
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

exports.updateUserInfo = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);

    if (!isMatched) {
        return next(new errorHandler("old password incorrect", 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
});

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new errorHandler("Not found user with this email", 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    //create reset url
    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset link is follow: \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;
    console.log(message);
    try {
        await sendEmail({
            email: user.email,
            subject: "password recovery",
            message,
        });

        res.status(200).json({
            success: true,
            message: `Sent email successfully!!!, email: ${user.email} `,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new errorHandler(error.message, 500));
    }
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //hash url token
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new errorHandler(
                "Password reset token is invalid or had been expired",
                400
            )
        );
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new errorHandler("Password does not match", 400));
    }
    //setup new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});