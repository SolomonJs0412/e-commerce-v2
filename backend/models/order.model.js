const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
                default: "test information"
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            },
            image: {
                type: String,
                required: true,
                default: "test information"
            },
            price: {
                type: Number,
                required: true,
                default: 0
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product",
            },
        }
    ],
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        },
    },
    paidAt: {
        type: Date,
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing",
    },
    deliveryAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        }
    },
});

const myDB = mongoose.connection.useDb('tiki');
orderInfo = myDB.model('Order', orderSchema);
module.exports = orderInfo;