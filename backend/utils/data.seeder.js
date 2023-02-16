const dotenv = require("dotenv");
const mongoose = require('mongoose');

const connectDatabase = require("../configs/databaseConnection");
const Product = require("../models/product.model");
const Category = require("../models/category.model");
const products = require("../../seederData/product.seed.json");
const categories = require("../../seederData/category.seed.json");

//Setting dotenv file
dotenv.config({ path: "../../configs.env" });

connectDatabase();

const deleteData = async () => {
    try {
        await Product.deleteMany();
        console.log('Products deleted');
        await Category.deleteMany();
        console.log('Categories deleted');
    } catch (error) {
        console.error(error)
    }
}

const insertData = async () => {
    try {
        await Product.create(products)
        console.log('Products seeded')
        await Category.create(categories)
        console.log('Categories seeded')
    } catch (error) {
        console.error(error)
    }
}

deleteData().then(() => insertData())
    .then(() => mongoose.disconnect())
    .catch(error => console.error(error))
