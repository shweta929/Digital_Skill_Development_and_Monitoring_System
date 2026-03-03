import mysql from 'mysql2/promise';

async function migrateSchema() {
    const pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'careerportal'
    });

    const columns = [
        { name: 'password', type: 'VARCHAR(255)' },
        { name: 'fullName', type: 'VARCHAR(255)' },
        { name: 'mobile', type: 'VARCHAR(20)' },
        { name: 'gender', type: 'VARCHAR(20)' },
        { name: 'dob', type: 'VARCHAR(50)' },
        { name: 'address', type: 'TEXT' }
    ];

    console.log('🔧 Starting schema migration...\n');

    for (const col of columns) {
        try {
            await pool.query(`ALTER TABLE students ADD COLUMN ${col.name} ${col.type}`);
            console.log(`✅ Added column: ${col.name}`);
        } catch (e) {
            if (e.message.includes('Duplicate column')) {
                console.log(`⚠️  Column ${col.name} already exists - skipping`);
            } else {
                console.error(`❌ Error adding ${col.name}:`, e.message);
                throw e;
            }
        }
    }

    console.log('\n✅ Schema migration complete!');
    await pool.end();
    process.exit(0);
}

migrateSchema().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
