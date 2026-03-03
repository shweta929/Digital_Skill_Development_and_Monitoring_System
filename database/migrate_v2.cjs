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

        // 1. Helper function to check column existence
        const addColumnIfMissing = async (table, column, definition) => {
            const [cols] = await connection.query(`DESCRIBE ${table}`);
            if (!cols.some(c => c.Field === column)) {
                console.log(`Adding ${column} to ${table}...`);
                await connection.query(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
                console.log(`✅ ${column} added.`);
            } else {
                console.log(`${column} already exists in ${table}.`);
            }
        };

        // 2. Update students table
        console.log("Checking students table...");
        await addColumnIfMissing('students', 'domain', "VARCHAR(255) DEFAULT ''");
        await addColumnIfMissing('students', 'bookReadCount', "INT DEFAULT 0");
        await addColumnIfMissing('students', 'feedbackCount', "INT DEFAULT 0");
        await addColumnIfMissing('students', 'meetingCount', "INT DEFAULT 0");
        await addColumnIfMissing('students', 'resumeCreatedCount', "INT DEFAULT 0");

        // 3. Create recorded_sessions table
        console.log("Creating/Updating recorded_sessions table...");
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

        // 4. Create books table
        console.log("Creating/Updating books table...");
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

        // 5. Create student_book_history table
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

        // 6. Seed Initial Recorded Sessions
        console.log("Seeding Recorded Sessions...");
        const sessions = [
            ['Java Core', 'OOP Concepts in Java', 'Mastering Object Oriented Programming with Java.', '7OSB1kxT2lE'],
            ['MERN Stack', 'Node.js & Express Guide', 'Build scalable backends with Node & Express.', 'kTYVZkY41eU'],
            ['Data Science', 'Python for Machine Learning', 'Introduction to libraries like Pandas and Sklearn.', 'aircAruvnKk'],
            ['DevOps', 'Docker & Kubernetes Mastery', 'Containerize and orchestrate your apps.', 'HXNe8-7z4E8']
        ];
        for (const [domain, title, desc, link] of sessions) {
            await connection.query(
                "INSERT IGNORE INTO recorded_sessions (domain, title, description, youtubeLink) VALUES (?, ?, ?, ?)",
                [domain, title, desc, link]
            );
        }

        // 7. Seed Initial Books
        console.log("Seeding Books...");
        const books = [
            ['Data Structures in Java', 'Understand algorithms, collections, and problem-solving techniques.', '/src/assets/Books/Algorithms Notes by Career Credentials .pdf', 'Java Core'],
            ['MERN Stack Guide', 'Build full-stack applications using MongoDB, Express, React & Node.', '/src/assets/Books/MongoDB Roadmap by Career Credentials.pdf', 'MERN Stack'],
            ['Aptitude Master Book', 'Sharpen your logical reasoning and quantitative skills.', '/src/assets/Books/Java Roadmap by Career Credentials.pdf', 'General'],
            ['Effective Java', 'Learn best practices for Java programming.', '/src/assets/Books/Effective Java.pdf', 'Java Core']
        ];
        for (const [title, desc, url, domain] of books) {
            await connection.query(
                "INSERT IGNORE INTO books (title, description, pdfUrl, domain) VALUES (?, ?, ?, ?)",
                [title, desc, url, domain]
            );
        }

        console.log("🎉 Database Migration and Seeding Complete!");
    } catch (err) {
        console.error("❌ Migration Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
