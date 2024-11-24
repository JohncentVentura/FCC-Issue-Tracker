const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;
const dbConnection = mongoose.connect(uri);

if (dbConnection) {
  console.log("Connected to database");
} else {
  console.error("Failed to connect to database");
}

module.exports = dbConnection;
