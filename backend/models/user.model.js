const mongoose = require('mongoose')
const validator = require('validator');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Ten la bat buoc"],
        maxLength: [50, "Ten phai duoi 50 ky tu"],
    },
    email: {
        type: String,
        required: [true, "Lam on nhap email"],
        unique: true,
        validate: [validator.isEmail, "Sai dinh dang email"],
    },
    password: {
        type: String,
        required: [true, "Mat khau la bat buoc"],
        minlength: [8, "Mat khau co toi thieu 8 ky tu"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            default: "avatars/r0zwdt0gdbqrcnr7f5rq",
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/dr9tyxp1a/image/upload/v1673959957/avatars/r0zwdt0gdbqrcnr7f5rq.jpg",
        },
    },
    role: {
        type: String,
        default: "user",
    },
    shop: {
        shop: {
            type: mongoose.Schema.ObjectId,
            ref: "Shop"
        },
        isCreated: {
            type: Boolean,
            default: false,
        }
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

//Encrypting password before saving user
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10);
});
//Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
//Return JWT Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME,
    });
};

//Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    //generate token
    const resetToken = crypto.randomBytes(20).toLocaleString("hex");
    //hash and set to reset resetPasswordToken
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    //token expire time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

const myDB = mongoose.connection.useDb('tiki');
const productInfo = myDB.model('User', userSchema);
module.exports = productInfo;