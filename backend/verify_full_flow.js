
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Configuration
const MONGO_URI = "mongodb://127.0.0.1:27017/careerportal";
const MYSQL_CONFIG = {
    host: 'localhost', user: 'root', password: 'root', database: 'careerportal'
};
const API_URL = "http://localhost:5001/api/meetings/smart-auto";

async function verifyFlow() {
    console.log("🔍 Starting End-to-End Verification...");

    // 1. Connect to Mongo & Create User
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const StudentSchema = new mongoose.Schema({
            fullName: String, email: String, mobile: String
        }, { strict: false });
        const Student = mongoose.model('Student', StudentSchema);

        const testEmail = `test_flow_${Date.now()}@example.com`;
        const newStudent = await Student.create({
            fullName: "Flow Tester",
            email: testEmail,
            mobile: "1234567890"
        });
        console.log(`✅ Created Mongo Student: ${newStudent._id} (${testEmail})`);

        // 2. Call Schedule API
        console.log("👉 Calling Schedule API...");
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentId: newStudent._id.toString(),
                email: testEmail,
                name: "Flow Tester",
                requestedDate: new Date().toISOString(),
                note: "End-to-End Verification"
            })
        });

        const data = await res.json();
        console.log(`API Response: ${res.status}`, data);

        if (res.status !== 201) {
            console.error("❌ API Failed. Stopping.");
            process.exit(1);
        }

        // 3. Verify MySQL
        console.log("👉 Checking MySQL...");
        const connection = await mysql.createConnection(MYSQL_CONFIG);
        const [rows] = await connection.query("SELECT * FROM one_on_one_schedules WHERE note = ?", ["End-to-End Verification"]);

        if (rows.length > 0) {
            console.log("✅ SUCCESS! Record found in MySQL:", rows[0]);
        } else {
            console.error("❌ FAILURE! API returned success but MySQL table is empty.");
        }
        await connection.end();

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyFlow();
