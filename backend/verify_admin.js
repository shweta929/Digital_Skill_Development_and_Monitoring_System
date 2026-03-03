import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

async function verify() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        const email = "careercredentialss@gmail.com";
        const password = "admin123";

        const [rows] = await connection.query("SELECT * FROM admins WHERE email = ?", [email]);
        if (rows.length === 0) {
            console.log("❌ Admin NOT found in DB!");
        } else {
            console.log("✅ Admin FOUND in DB.");
            const admin = rows[0];
            const isMatch = await bcrypt.compare(password, admin.password);
            console.log("✅ Password match check:", isMatch);
            console.log("Admin Row Data:", JSON.stringify({ ...admin, password: "[HASHED]" }));
        }
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

verify();
