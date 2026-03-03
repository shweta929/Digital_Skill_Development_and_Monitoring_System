const mysql = require('mysql2/promise');

async function run() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'careerportal'
    });

    try {
        const columns = [
            { name: 'password', type: 'VARCHAR(255)' },
            { name: 'fullName', type: 'VARCHAR(255)' },
            { name: 'mobile', type: 'VARCHAR(20)' },
            { name: 'gender', type: 'VARCHAR(20)' },
            { name: 'dob', type: 'VARCHAR(50)' },
            { name: 'address', type: 'TEXT' }
        ];

        for (const col of columns) {
            try {
                await pool.query(`ALTER TABLE students ADD COLUMN ${col.name} ${col.type}`);
                console.log(`✅ Added column: ${col.name}`);
            } catch (e) {
                if (e.message.includes('Duplicate column')) {
                    console.log(`⚠️ Column ${col.name} already exists`);
                } else {
                    throw e;
                }
            }
        }

        console.log('✅ Schema migration complete');
    } catch (e) {
        console.error('❌ Error:', e.message);
    }

    process.exit(0);
}

run();
