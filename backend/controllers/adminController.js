import mysqlPool from "../config/mysql.js";
import bcrypt from "bcryptjs";

export const getCRMAnalytics = async (req, res) => {
    try {
        // 1. Total Students
        const [students] = await mysqlPool.query("SELECT COUNT(*) as count FROM students");
        const totalStudents = students[0].count;

        // 2. Tests Taken (assuming test_results table)
        // Check if table exists first to avoid crash if not created
        let totalTests = 0;
        let topCareerDomain = "N/A";

        try {
            const [tests] = await mysqlPool.query("SELECT COUNT(*) as count FROM test_results");
            totalTests = tests[0].count;

            const [domains] = await mysqlPool.query(`
                SELECT recommended_career, COUNT(*) as count 
                FROM test_results 
                GROUP BY recommended_career 
                ORDER BY count DESC 
                LIMIT 1
            `);
            if (domains.length > 0) {
                topCareerDomain = domains[0].recommended_career;
            }
        } catch (err) {
            console.log("Analytics: test_results table likely missing or empty", err.message);
        }

        // 3. Total Feedbacks
        const [feedbacks] = await mysqlPool.query("SELECT COUNT(*) as count FROM student_feedback");
        const totalFeedbacks = feedbacks[0].count;

        // 4. Total Meetings
        const [meetings] = await mysqlPool.query("SELECT COUNT(*) as count FROM one_on_one_schedules");
        const totalMeetings = meetings[0].count;

        res.json({
            totalStudents,
            totalTests,
            totalFeedbacks,
            totalMeetings,
            topCareerDomain
        });

    } catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ error: "Failed to fetch analytics data" });
    }
};

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[AdminLogin] Attempt for: ${email}`);

        const [rows] = await mysqlPool.query("SELECT * FROM admins WHERE email = ?", [email]);

        if (rows.length === 0) {
            console.log(`[AdminLogin] ❌ User for ${email} not found in DB`);
            return res.status(401).json({ message: "Invalid Admin Credentials" });
        }

        const admin = rows[0];
        console.log(`[AdminLogin] ✅ Admin found: ${admin.email}. Checking password...`);
        const isMatch = await bcrypt.compare(password, admin.password);

        if (isMatch) {
            console.log(`[AdminLogin] 🎉 Login successful for ${admin.email}`);
            return res.json({
                message: "Admin Login Successful",
                admin: { email: admin.email, role: admin.role, name: admin.name }
            });
        } else {
            console.log(`[AdminLogin] ❌ Password mismatch for ${admin.email}`);
            return res.status(401).json({ message: "Invalid Admin Credentials" });
        }
    } catch (err) {
        console.error(`[AdminLogin] 🔥 Error: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
};

export const getCRMLeads = async (req, res) => {
    try {
        console.log("API Hit: getCRMLeads"); // Debug Log
        // Fetch all students with their latest test result (if any)
        const query = `
            SELECT 
                s.id as lead_id,
                s.fullName,
                s.email,
                s.mobile,
                (SELECT recommended_career FROM test_results tr WHERE tr.student_id = s.id ORDER BY createdAt DESC LIMIT 1) as test_result,
                'Cloud / Enterprise Backend / Product Engineer' as recommended_path,
                'New' as lead_status
            FROM students s
            ORDER BY s.id DESC
        `;

        const [rows] = await mysqlPool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error fetching leads:", err);
        res.status(500).json({ error: "Failed to fetch CRM leads", details: err.message, stack: err.stack });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const [rows] = await mysqlPool.query("SELECT * FROM student_feedback ORDER BY created_at DESC");
        // Normalize IDs to _id for frontend compatibility if needed, or just send as is
        res.json(rows);
    } catch (err) {
        console.error("Error fetching feedbacks:", err);
        res.status(500).json({ error: "Failed to fetch feedbacks" });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        await mysqlPool.query("DELETE FROM student_feedback WHERE id = ?", [id]);
        res.json({ message: "Feedback deleted successfully" });
    } catch (err) {
        console.error("Error deleting feedback:", err);
        res.status(500).json({ error: "Failed to delete feedback" });
    }
};
