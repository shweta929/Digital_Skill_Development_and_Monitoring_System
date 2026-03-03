import pool from './config/mysql.js';

async function checkTables() {
    try {
        const [rows] = await pool.query("SHOW TABLES");
        console.log("Tables in careerportal:", rows);

        const [studentCols] = await pool.query("DESCRIBE students").catch(() => [[], []]);
        if (studentCols && studentCols.length) {
            console.log("Students columns:", studentCols);
        } else {
            console.log("Students table not found.");
        }
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

checkTables();
