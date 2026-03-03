import mysqlPool from './config/mysql.js';

async function verifyCounts() {
    try {
        console.log("--- Verifying Database Counts ---");

        const [students] = await mysqlPool.query("SELECT COUNT(*) as c FROM students");
        console.log("Students:", students[0].c);

        try {
            const [tests] = await mysqlPool.query("SELECT COUNT(*) as c FROM test_results");
            console.log("Test Results:", tests[0].c);
        } catch (e) { console.log("Test Results Table Missing"); }

        try {
            const [feedback] = await mysqlPool.query("SELECT COUNT(*) as c FROM student_feedback");
            console.log("Feedback:", feedback[0].c);
        } catch (e) { console.log("Feedback Table Missing"); }

        try {
            const [meetings] = await mysqlPool.query("SELECT COUNT(*) as c FROM one_on_one_schedules");
            console.log("Meetings:", meetings[0].c);
        } catch (e) { console.log("Meetings Table Missing"); }

        process.exit(0);
    } catch (err) {
        console.error("DB Error:", err);
        process.exit(1);
    }
}

verifyCounts();
