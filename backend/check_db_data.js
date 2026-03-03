
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function checkData() {
    const connection = await mysql.createConnection({
        host: 'localhost', user: 'root', password: 'root', database: 'careerportal'
    });
    const [rows] = await connection.query("SELECT * FROM one_on_one_schedules");
    console.log("📊 Current Meetings in MySQL:", rows);
    await connection.end();
}
checkData();
