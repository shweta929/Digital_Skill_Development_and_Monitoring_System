
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function createStudentsTable() {
    console.log("🛠 Creating 'students' table...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'careerportal'
    });

    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS students (
                id INT AUTO_INCREMENT PRIMARY KEY,
                fullName VARCHAR(255) NOT NULL,
                gender VARCHAR(50),
                dob DATE,
                mobile VARCHAR(20),
                email VARCHAR(255) UNIQUE NOT NULL,
                address TEXT,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log("✅ Table 'students' created successfully.");

        await connection.query(`
             CREATE TABLE IF NOT EXISTS education_details (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT,
                tenthBoard VARCHAR(50),
                tenthYear INT,
                tenthPercentage FLOAT,
                twelfthBoard VARCHAR(50),
                twelfthYear INT,
                twelfthPercentage FLOAT,
                collegeName VARCHAR(255),
                degree VARCHAR(100),
                graduationStream VARCHAR(100),
                graduationYear INT,
                graduationPercentage FLOAT,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Table 'education_details' created successfully.");

    } catch (err) {
        console.error("❌ Error creating table:", err.message);
    } finally {
        await connection.end();
    }
}

createStudentsTable();
