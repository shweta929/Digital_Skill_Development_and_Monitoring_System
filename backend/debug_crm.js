
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'careerportal'
};

const debugCRM = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log("✅ Connected to MySQL");

        const query = `
            SELECT 
                s.id as lead_id,
                s.fullName,
                s.email,
                s.mobile,
                tr.recommended_career as test_result,
                'Cloud / Enterprise Backend / Product Engineer' as recommended_path,
                'New' as lead_status
            FROM students s
            LEFT JOIN (
                SELECT student_id, recommended_career 
                FROM test_results 
                ORDER BY created_at DESC
            ) tr ON s.id = tr.student_id
            GROUP BY s.id
            ORDER BY s.id DESC
        `;

        const [rows] = await connection.query(query);
        console.log(`📊 Query Results (${rows.length} rows):`);
        console.log(JSON.stringify(rows, null, 2));

        await connection.end();
    } catch (err) {
        console.error("❌ Error:", err.message);
    }
};

debugCRM();
