const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
});

connection.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL!");

    const databases = ["careerportal", "career_db", "SmartResumeBuilder"];

    let completed = 0;
    databases.forEach(db => {
        connection.query(`CREATE DATABASE IF NOT EXISTS ${db}`, (err) => {
            if (err) {
                console.error(`Error creating database ${db}:`, err);
            } else {
                console.log(`Database ${db} verified/created.`);
            }
            completed++;
            if (completed === databases.length) {
                connection.end();
                process.exit(0);
            }
        });
    });
});
