const mysql = require("mysql2/promise");

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

async function fixSchema() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log("✅ Connected to MySQL.");

        // 1. Rename feedback_text to comment if needed
        const [columns] = await connection.query("DESCRIBE student_feedback");
        const hasFeedbackText = columns.some(c => c.Field === 'feedback_text');
        const hasComment = columns.some(c => c.Field === 'comment');

        if (hasFeedbackText && !hasComment) {
            console.log("Renaming 'feedback_text' to 'comment'...");
            await connection.query("ALTER TABLE student_feedback CHANGE feedback_text comment TEXT NOT NULL");
            console.log("✅ Renamed successfully.");
        }

        // 2. Add student_name if missing
        const hasStudentName = columns.some(c => c.Field === 'student_name');
        if (!hasStudentName) {
            console.log("Adding 'student_name' column...");
            await connection.query("ALTER TABLE student_feedback ADD COLUMN student_name VARCHAR(255) AFTER student_id");
            console.log("✅ Added successfully.");
        }

        console.log("🎉 Database schema fix complete!");

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

fixSchema();
