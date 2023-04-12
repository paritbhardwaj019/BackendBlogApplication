const mongoose = require("mongoose");

const mongodbUrl = process.env.MONGODB_URI;
exports.dbConnect = async () => {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("Database Connected Successfully!");
  } catch (error) {
    console.log("Database NotConnected Successfully!");
  }
};
