/**
 * Database Configuration
 * Handles MongoDB connection using Mongoose
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_URI_PRODUCTION
        : process.env.MONGODB_URI;

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✓ MongoDB Connected Successfully");
  } catch (error) {
    console.error("✗ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
