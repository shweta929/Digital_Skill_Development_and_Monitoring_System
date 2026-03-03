const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

async function updateAdmin() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        const email = "careercredentialss@gmail.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);

        await connection.query(
            "INSERT INTO admins (name, email, password, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = ?, name = ?",
            ["Admin", email, hashedPassword, "admin", hashedPassword, "Admin"]
        );

        console.log(`✅ Admin updated in database: ${email} / ${password}`);
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

updateAdmin();
