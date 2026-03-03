const mysql = require("mysql2/promise");

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

async function check() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log("✅ Connected to MySQL.");

        const [tables] = await connection.query("SHOW TABLES");
        console.log("Tables in careerportal:", tables.map(t => Object.values(t)[0]));

        if (tables.some(t => Object.values(t)[0] === 'student_feedback')) {
            const [columns] = await connection.query("DESCRIBE student_feedback");
            console.log("student_feedback schema:", columns.map(c => `${c.Field} (${c.Type})`));
        } else {
            console.log("❌ student_feedback table is MISSING!");
        }

        if (tables.some(t => Object.values(t)[0] === 'students')) {
            const [columns] = await connection.query("DESCRIBE students");
            console.log("students schema:", columns.map(c => `${c.Field} (${c.Type})`));
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

check();
