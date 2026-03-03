import pool from './config/mysql.js';

async function createTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS student_feedback (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                student_name VARCHAR(255),
                rating INT,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `;

        await pool.query(createTableQuery);
        console.log("✅ Table 'student_feedback' created or already exists.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating table:", err);
        process.exit(1);
    }
}

createTable();
