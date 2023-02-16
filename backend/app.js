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

app.use("/api/v1", products);

app.use(middlewareErrorHandler);
module.exports = app;