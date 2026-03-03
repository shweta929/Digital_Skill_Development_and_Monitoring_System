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

        // Helper to run SQL and ignore errors (useful for ADD COLUMN if it exists)
        const runSafe = async (sql, params = []) => {
            try {
                await connection.query(sql, params);
            } catch (err) {
                if (!err.message.includes("Duplicate column name") && !err.message.includes("already exists")) {
                    console.error(`- Error running SQL: ${sql.substring(0, 50)}... -> ${err.message}`);
                }
            }
        };

        console.log("Updating students table...");
        await runSafe("ALTER TABLE students ADD COLUMN domain VARCHAR(255) DEFAULT ''");
        await runSafe("ALTER TABLE students ADD COLUMN bookReadCount INT DEFAULT 0");
        await runSafe("ALTER TABLE students ADD COLUMN feedbackCount INT DEFAULT 0");
        await runSafe("ALTER TABLE students ADD COLUMN meetingCount INT DEFAULT 0");
        await runSafe("ALTER TABLE students ADD COLUMN resumeCreatedCount INT DEFAULT 0");

        console.log("Creating/Updating recorded_sessions table...");
        await runSafe(`
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

        console.log("Creating/Updating books table...");
        await runSafe(`
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

        console.log("Creating student_book_history table...");
        await runSafe(`
            CREATE TABLE IF NOT EXISTS student_book_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id INT NOT NULL,
                book_id INT NOT NULL,
                isRead BOOLEAN DEFAULT FALSE,
                readAt TIMESTAMP NULL,
                UNIQUE KEY student_book (student_id, book_id)
            )
        `);

        // Seeds
        console.log("Seeding Recorded Sessions...");
        const sessionSeeds = [
            ['Java Core', 'OOP Concepts in Java', 'Mastering OOP.', '7OSB1kxT2lE'],
            ['MERN Stack', 'Node.js Guide', 'Backend with Node.', 'kTYVZkY41eU'],
            ['Data Science', 'Python for ML', 'Pandas & Sklearn.', 'aircAruvnKk']
        ];
        for (const s of sessionSeeds) {
            await runSafe("INSERT IGNORE INTO recorded_sessions (domain, title, description, youtubeLink) VALUES (?, ?, ?, ?)", s);
        }

        console.log("Seeding Books...");
        const bookSeeds = [
            ['Data Structures in Java', 'Algo & DS prep.', '/src/assets/Books/Algorithms Notes by Career Credentials .pdf', 'Java Core'],
            ['MERN Stack Guide', 'Fullstack MongoDB.', '/src/assets/Books/MongoDB Roadmap by Career Credentials.pdf', 'MERN Stack'],
            ['Aptitude Master', 'Logical reasoning.', '/src/assets/Books/Java Roadmap by Career Credentials.pdf', 'General']
        ];
        for (const b of bookSeeds) {
            await runSafe("INSERT IGNORE INTO books (title, description, pdfUrl, domain) VALUES (?, ?, ?, ?)", b);
        }

        console.log("🎉 Migration Complete!");
    } catch (err) {
        console.error("❌ Fatal Migration Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
