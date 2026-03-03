import pool from './config/mysql.js';

async function createTable() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS one_on_one_schedules (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                trainer_id INT,
                scheduled_at DATETIME,
                original_scheduled_at DATETIME,
                status ENUM('Requested','Booked','Rescheduled','Completed','Canceled','Rejected') DEFAULT 'Requested',
                reschedule_count INT DEFAULT 0,
                remarks TEXT,
                meetLink VARCHAR(255),
                finalDate VARCHAR(255),
                note TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `;

        await pool.query(createTableQuery);
        console.log("✅ Table 'one_on_one_schedules' created or already exists.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error creating table:", err);
        process.exit(1);
    }
}

createTable();
