
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load local .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function verifySystem() {
    console.log("🔍 Starting System Verification (from Backend folder)...\n");

    // 1. Check MySQL Connection & Table
    console.log("👉 [1/3] Checking MySQL Database...");
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME || 'careerportal'
        });
        console.log("   ✅ MySQL Connection Successful.");

        const [rows] = await connection.query("SHOW TABLES LIKE 'one_on_one_schedules'");
        if (rows.length > 0) {
            console.log("   ✅ Table 'one_on_one_schedules' exists.");

            // Check Schema columns roughly
            const [cols] = await connection.query("DESCRIBE one_on_one_schedules");
            const colNames = cols.map(c => c.Field);
            if (colNames.includes('finalDate') && colNames.includes('meetLink')) {
                console.log("   ✅ Table Schema looks correct (migrated).");
            } else {
                console.error("   ❌ Table Schema missing new columns!");
            }

        } else {
            console.error("   ❌ Table 'one_on_one_schedules' NOT FOUND!");
        }
    } catch (err) {
        console.error("   ❌ MySQL Error:", err.message);
        console.log("      (Make sure your .env has correct DB credentials)");
    } finally {
        if (connection) await connection.end();
    }

    // 2. Check Backend API Reachability
    // Note: Assuming server runs on PORT from .env or default 5001
    const PORT = process.env.PORT || 5001;
    console.log(`\n👉 [2/3] Checking Backend API (localhost:${PORT})...`);

    // Simple fetch check
    try {
        // We use dynamic import for node-fetch if available, or just built-in fetch in newer Node
        const response = await fetch(`http://localhost:${PORT}/api/meetings/list?studentId=test`);

        if (response.status === 200) {
            console.log("   ✅ Backend is UP and responding (Status 200).");
        } else {
            console.log(`   ⚠️ Backend responded with Status ${response.status} (This is okay if just empty list)`);
        }
    } catch (err) {
        console.error("   ❌ Backend Unreachable:", err.message);
        console.error("   ⚠️ DID YOU RESTART THE SERVER? The new code needs a restart.");
    }

    // 3. Check Frontend Files
    console.log("\n👉 [3/3] Checking Static Files...");
    const adminViewUrl = (`http://localhost:${PORT}/admin-meetings-view.html`);
    try {
        const res = await fetch(adminViewUrl);
        if (res.status === 200) {
            console.log("   ✅ 'admin-meetings-view.html' is being served correctly.");
        } else {
            console.log(`   ❌ Failed to serve HTML file. Status: ${res.status}`);
        }
    } catch (err) {
        console.error("   ❌ Static File Error:", err.message);
    }

    console.log("\n✅ Verification Complete.");
}

verifySystem();
