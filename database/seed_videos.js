import mysql from 'mysql2/promise';

async function seed() {
    const config = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'careerportal'
    };

    try {
        const connection = await mysql.createConnection(config);
        console.log('Connected to MySQL careerportal ✅');

        await connection.execute('DELETE FROM recorded_sessions');
        console.log('Cleared existing sessions.');

        const videos = [
            ['Java Full Masterclass', 'enterprise', 'GCXKd7DfR0c', 'Mastering Java from basics to advanced features like Streams, Collections, and Multi-threading. Perfect for career placement.'],
            ['Spring Boot and Cloud Integration', 'enterprise', 'CDbQVssqGcE', 'Deep dive into building scalable enterprise applications using Spring Boot, Microservices, and Cloud-native architectures.'],
            ['Python for Data Science', 'intelligence', 'kTYVZkY41eU', 'Essential Python programming for data analysis, machine learning foundations, and automation scripting for technical professionals.'],
            ['React Native App Dev', 'systems', 'H1vW9P6GQPQ', 'Build high-performance cross-platform mobile applications for iOS and Android using a single React codebase.'],
            ['Ultimate Node.js Guide', 'automation', '-BvgaDXy_z8', 'Comprehensive backend engineering with Node.js, Express, and database integration for high-concurrency systems.'],
            ['Career Success Briefing', 'General', 'dQw4w9WgXcQ', 'Mastering the technical interview landscape and achieving career milestones with expert guidance.']
        ];

        for (const [title, domain, youtubeLink, description] of videos) {
            await connection.execute(
                'INSERT INTO recorded_sessions (title, domain, youtubeLink, description) VALUES (?, ?, ?, ?)',
                [title, domain, youtubeLink, description]
            );
        }

        console.log('Successfully seeded 6 videos! 🎬');
        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err.message);
        process.exit(1);
    }
}

seed();
