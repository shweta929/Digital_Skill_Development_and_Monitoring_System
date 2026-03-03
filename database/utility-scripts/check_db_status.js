const mysql = require("mysql2/promise");

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

async function check() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log("Connected to MySQL.");

        const [admins] = await connection.query("SELECT id, name, email FROM admins");
        console.log("Admins Count:", admins.length);
        admins.forEach(a => console.log(` - ${a.name} (${a.email})`));

        const [trainers] = await connection.query("SELECT id, fullName, email FROM trainers");
        console.log("Trainers Count:", trainers.length);
        trainers.forEach(t => console.log(` - ${t.fullName} (${t.email})`));

    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        if (connection) await connection.end();
    }
}

check();
