const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Can nhap ten cho shop'],
        maxLength: [200, 'Khong nhap vuot qua 200 ky tu']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }
});

const myDB = mongoose.connection.useDb('tiki');
const shopInfo = myDB.model('Shop', shopSchema);
module.exports = shopInfo;