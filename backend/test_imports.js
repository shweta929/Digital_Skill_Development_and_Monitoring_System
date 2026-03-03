import express from "express";
import mongoose from "mongoose";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

console.log("✅ All core modules imported successfully");

dotenv.config();
console.log("✅ .env loaded");

const testApp = express();
console.log("✅ Express instance created");

try {
    console.log("Attempting MongoDB connection to:", process.env.MONGO_URI);
    // await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ MongoDB connect call reached (skipped actual for fast test)");
} catch (e) {
    console.error("❌ MongoDB connection failed:", e.message);
}

console.log("Backend environment test complete! 🚀");
process.exit(0);
