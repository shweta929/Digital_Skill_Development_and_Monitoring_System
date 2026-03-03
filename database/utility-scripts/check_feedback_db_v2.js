const mysql = require("mysql2/promise");
const fs = require("fs");

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "careerportal"
};

async function check() {
    let connection;
    let output = "";
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        output += "✅ Connected to MySQL.\n";

        const [tables] = await connection.query("SHOW TABLES");
        output += "Tables in careerportal: " + JSON.stringify(tables.map(t => Object.values(t)[0])) + "\n\n";

        const tablesToCheck = ['student_feedback', 'students'];
        for (const tableName of tablesToCheck) {
            if (tables.some(t => Object.values(t)[0] === tableName)) {
                const [columns] = await connection.query(`DESCRIBE ${tableName}`);
                output += `${tableName} schema:\n`;
                columns.forEach(c => {
                    output += ` - ${c.Field} | ${c.Type} | Null: ${c.Null} | Key: ${c.Key} | Default: ${c.Default}\n`;
                });
                output += "\n";
            } else {
                output += `❌ ${tableName} table is MISSING!\n\n`;
            }
        }

    } catch (err) {
        output += `❌ Error: ${err.message}\n`;
    } finally {
        if (connection) await connection.end();
        fs.writeFileSync("db_schema_output.txt", output);
        console.log("Results written to db_schema_output.txt");
    }
}

check();
