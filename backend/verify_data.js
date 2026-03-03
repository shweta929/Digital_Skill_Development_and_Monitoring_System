
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'careerportal'
};

const verifyData = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("✅ Connected to MySQL");

        // Count Students
        const [students] = await connection.query("SELECT COUNT(*) as count FROM students");
        console.log(`👨‍🎓 Total Students: ${students[0].count}`);

        if (students[0].count > 0) {
            const [studentRows] = await connection.query("SELECT id, fullName, email FROM students LIMIT 3");
            console.log("   Sample Students:", JSON.stringify(studentRows));
        }

        // Count Test Results
        const [results] = await connection.query("SELECT COUNT(*) as count FROM test_results");
        console.log(`📝 Total Test Results: ${results[0].count}`);

        if (results[0].count > 0) {
            const [resultRows] = await connection.query("SELECT id, student_id, recommended_career, createdAt FROM test_results LIMIT 3");
            console.log("   Sample Results:", JSON.stringify(resultRows));
        }

        // Try the actual CRM query again
        const query = `
            SELECT 
                s.id as lead_id,
                s.fullName,
                s.email,
                s.mobile,
                (SELECT recommended_career FROM test_results tr WHERE tr.student_id = s.id ORDER BY createdAt DESC LIMIT 1) as test_result
            FROM students s
            ORDER BY s.id DESC
        `;
        const [queryRows] = await connection.query(query);
        console.log(`📊 CRM Query Rows Retrieved: ${queryRows.length}`);

        await connection.end();
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
};

verifyData();
