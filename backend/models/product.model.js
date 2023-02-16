const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Yeu cau nhap ten san pham"],
        trim: true,
        maxLength: [500, "Ten khong vuot qua 500 ky tu"]
    },
    description: {
        type: String,
        required: [true, "Yeu cau nhap mo ta"]
    },
    price: {
        type: Number,
        default: 0.0,
        required: [true, "Yeu cau nhap gia tien"],
        maxLength: [10, "Nhap gia khong qua 10 ky tu"]
    },
    images: [
        {
            publicId: {
                type: String,
                required: [true, "error"]
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    ratings: {
        type: Number,
        default: 0.0,
    },
    brand: {
        type: mongoose.Schema.ObjectId,
        ref: "Brand",
    },
    stock: {
        type: Number,
        required: [true, "Can nhap so luong"],
        default: 0.0,
        maxLength: [5, "So luong khong vuot qua 5 chu so"]
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            nameOfReviewer: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    categories: [
        {
            category: {
                type: mongoose.Schema.ObjectId,
                ref: "Category",
                required: true
            }
        }
    ]
});

const myDB = mongoose.connection.useDb('tiki');
const productInfo = myDB.model('Product', productSchema);
module.exports = productInfo;