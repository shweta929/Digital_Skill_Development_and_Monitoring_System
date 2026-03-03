const mysql = require("mysql2/promise");

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log("✅ Connected to MySQL.");

        // 1. Update students table
        console.log("Updating students table...");
        await connection.query(`
            ALTER TABLE students 
            ADD COLUMN IF NOT EXISTS domain VARCHAR(255) DEFAULT '',
            ADD COLUMN IF NOT EXISTS bookReadCount INT DEFAULT 0,
            ADD COLUMN IF NOT EXISTS feedbackCount INT DEFAULT 0,
            ADD COLUMN IF NOT EXISTS meetingCount INT DEFAULT 0,
            ADD COLUMN IF NOT EXISTS resumeCreatedCount INT DEFAULT 0
        `);
        console.log("✅ students table updated.");

        // 2. Create recorded_sessions table
        console.log("Creating recorded_sessions table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS recorded_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                domain VARCHAR(255) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                youtubeLink VARCHAR(255) NOT NULL,
                uploadedBy VARCHAR(255) DEFAULT 'Admin',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ recorded_sessions table created.");

        // 3. Create books table
        console.log("Creating books table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS books (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                pdfUrl VARCHAR(255) NOT NULL,
                domain VARCHAR(255) DEFAULT 'General',
                uploadedBy VARCHAR(255) DEFAULT 'Admin',
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ books table created.");

        // 4. Create student_book_history table for reordering logic
        console.log("Creating student_book_history table...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS student_book_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                book_id INT NOT NULL,
                isRead BOOLEAN DEFAULT FALSE,
                readAt TIMESTAMP NULL,
                UNIQUE KEY student_book (student_id, book_id)
            )
        `);
        console.log("✅ student_book_history table created.");

        console.log("🎉 Database Migration Complete!");

    } catch (err) {
        console.error("❌ Migration Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
