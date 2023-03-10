const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_LOCAL_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then((con) => {
            console.log(`MongoDB connected success with host: ${con.connection.host}`);
        });
};

module.exports = connectDatabase;