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

        const addColumn = async (column, definition) => {
            const [rows] = await connection.query(`SHOW COLUMNS FROM students LIKE ?`, [column]);
            if (rows.length === 0) {
                console.log(`Adding ${column}...`);
                await connection.query(`ALTER TABLE students ADD COLUMN ${column} ${definition}`);
                console.log(`✅ ${column} added.`);
            } else {
                console.log(`Column ${column} already exists.`);
            }
        };

        await addColumn('domain', "VARCHAR(255) DEFAULT ''");
        await addColumn('bookReadCount', "INT DEFAULT 0");
        await addColumn('feedbackCount', "INT DEFAULT 0");
        await addColumn('meetingCount', "INT DEFAULT 0");
        await addColumn('resumeCreatedCount', "INT DEFAULT 0");

        // Tables
        await connection.query(`CREATE TABLE IF NOT EXISTS recorded_sessions (id INT AUTO_INCREMENT PRIMARY KEY, domain VARCHAR(255) NOT NULL, title VARCHAR(255) NOT NULL, description TEXT, youtubeLink VARCHAR(255) NOT NULL, uploadedBy VARCHAR(255) DEFAULT 'Admin', createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await connection.query(`CREATE TABLE IF NOT EXISTS books (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, description TEXT, pdfUrl VARCHAR(255) NOT NULL, domain VARCHAR(255) DEFAULT 'General', uploadedBy VARCHAR(255) DEFAULT 'Admin', createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await connection.query(`CREATE TABLE IF NOT EXISTS student_book_history (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, book_id INT NOT NULL, isRead BOOLEAN DEFAULT FALSE, readAt TIMESTAMP NULL, UNIQUE KEY student_book (student_id, book_id))`);

        // Seeds
        await connection.query("INSERT IGNORE INTO recorded_sessions (domain, title, description, youtubeLink) VALUES ('Java Core', 'OOP Concepts in Java', 'Mastering OOP.', '7OSB1kxT2lE'), ('MERN Stack', 'Node.js Guide', 'Backend with Node.', 'kTYVZkY41eU'), ('Data Science', 'Python for ML', 'Pandas & Sklearn.', 'aircAruvnKk')");
        await connection.query("INSERT IGNORE INTO books (title, description, pdfUrl, domain) VALUES ('Data Structures in Java', 'Algo & DS prep.', '/src/assets/Books/Algorithms Notes by Career Credentials .pdf', 'Java Core'), ('MERN Stack Guide', 'Fullstack MongoDB.', '/src/assets/Books/MongoDB Roadmap by Career Credentials.pdf', 'MERN Stack'), ('Aptitude Master', 'Logical reasoning.', '/src/assets/Books/Java Roadmap by Career Credentials.pdf', 'General')");

        console.log("🎉 Migration Complete!");
    } catch (err) {
        console.error("❌ Migration Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}
migrate();
