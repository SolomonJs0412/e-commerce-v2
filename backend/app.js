const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const middlewareErrorHandler = require("./expressHelper/errors.list");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

dotenv.config({ path: "../configs.env" });

const products = require("./routes/product.routes")
const categories = require("./routes/category.routes")
const auth = require("./routes/auth.routes")
const admin = require("./routes/admin.routes")
const shop = require("./routes/shop.routes")
const order = require("./routes/order.routes")
const payment = require("./routes/payment.routes")

app.use("/api/v1", products);
app.use("/api/v1", categories);
app.use("/api/v1", auth);
app.use("/api/v1", admin);
app.use("/api/v1", shop);
app.use("/api/v1", order);
app.use("/api/v1", payment);

app.use(middlewareErrorHandler);
module.exports = app;