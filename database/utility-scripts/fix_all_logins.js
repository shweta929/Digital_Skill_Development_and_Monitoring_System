const mysql = require("mysql2/promise");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MYSQL_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

const MONGO_URI = "mongodb://127.0.0.1:27017/careerportal";

// Define Schemas for Mongo
const StudentSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "student" }
});

const AdminSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "admin" }
});

async function fixLogins() {
    const email = "careercredentialss@gmail.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("--- Starting Global Login Fix ---");

    // 1. Fix MySQL
    let mysqlConn;
    try {
        mysqlConn = await mysql.createConnection(MYSQL_CONFIG);
        console.log("✅ Connected to MySQL.");

        // Admin
        await mysqlConn.query(
            "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?",
            ["Admin", email, hashedPassword, "admin", hashedPassword]
        );
        console.log("✅ Admin seeded in MySQL.");

        // Student
        await mysqlConn.query(
            "INSERT INTO students (fullName, email, password) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password = ?",
            ["Student User", email, hashedPassword, hashedPassword]
        );
        console.log("✅ Student seeded in MySQL.");

    } catch (err) {
        console.error("❌ MySQL Error:", err.message);
    } finally {
        if (mysqlConn) await mysqlConn.end();
    }

    // 2. Fix MongoDB
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB.");

        const StudentModel = mongoose.models.Student || mongoose.model("Student", StudentSchema);
        const AdminModel = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

        // Seed Student
        await StudentModel.findOneAndUpdate(
            { email },
            { fullName: "Student User", password: hashedPassword },
            { upsert: true, new: true }
        );
        console.log("✅ Student seeded in MongoDB.");

        // Seed Admin
        await AdminModel.findOneAndUpdate(
            { email },
            { name: "Admin", password: hashedPassword },
            { upsert: true, new: true }
        );
        console.log("✅ Admin seeded in MongoDB.");

    } catch (err) {
        console.error("❌ MongoDB Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }

    console.log("--- Global Login Fix Complete ---");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
}

fixLogins();
