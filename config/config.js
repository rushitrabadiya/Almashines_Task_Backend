const dotenv = require("dotenv");
dotenv.config("");

exports.DB = process.env.DATABASE;
exports.PORT = process.env.PORT;
