const dotenv = require('dotenv');
const app = require("./app");

const connectDatabase = require("./configs/databaseConnection");

dotenv.config({ path: "./configs.env" })

connectDatabase();

process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log("Shuting down server due to uncaught exception");
    process.exit(1);
});

const server = app.listen(process.env.PORT, () => {
    console.log(
        `Server stream on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
    );
});

process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shuting down the server due to Unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});