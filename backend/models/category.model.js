const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    nameOfCategory: {
        type: String,
        required: [true, 'Can nhap ten cho loai san pham'],
        maxLength: [200, 'Khong nhap vuot qua 200 ky tu']
    },
    description: {
        type: String,
        required: [true, 'Can nhap ten cho loai san pham'],
        maxLength: [500, 'Khong nhap vuot qua 500 ky tu']
    },
    products: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product"
        }
    }],
    countOfProducts: {
        type: Number,
        required: true,
        default: 0
    },
    images: [
        {
            publicId: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ]
});

const myDB = mongoose.connection.useDb('tiki');
const categoryInfo = myDB.model('Category', categorySchema);
module.exports = categoryInfo;