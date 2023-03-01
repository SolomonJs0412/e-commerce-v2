const Order = require("../models/order.model")
const catchAsyncErrors = require("../expressHelper/catchAsyncErrors")

exports.createOrder = catchAsyncErrors(async (req, res, next) => {

});

exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        return next(new ErrorHandler("no order found with this id ", 404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});