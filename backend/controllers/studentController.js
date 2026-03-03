import Student from "../models/Student.js";
import mysqlPool from "../config/mysql.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { fullName, email, password, mobile, gender, dob, address } = req.body;
        console.log(`[Registration] Attempt for: ${email}`);

        // 1. Check if email exists in Mongo or MySQL
        const existingMongo = await Student.findOne({ email });
        if (existingMongo) return res.status(400).json({ message: "Email already registered in system." });

        const [existingSql] = await mysqlPool.query("SELECT id FROM students WHERE email = ?", [email]);
        if (existingSql.length > 0) return res.status(400).json({ message: "Email already registered in system." });

        // 2. Hash Password
        console.log("[Registration] Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Save to MongoDB
        console.log("[Registration] Saving to MongoDB...");
        const newStudent = new Student({
            fullName, email, password: hashedPassword,
            mobile, gender, dob, address
        });
        await newStudent.save();
        console.log("[Registration] Saved to MongoDB ✅");

        // 4. Save to MySQL
        console.log("[Registration] Saving to MySQL...");
        await mysqlPool.query(
            "INSERT INTO students (fullName, email, password, mobile, gender, dob, address) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [fullName, email, hashedPassword, mobile, gender, dob, address]
        );
        console.log("[Registration] Saved to MySQL ✅");

        console.log(`✅ Student registered successfully: ${email}`);
        res.status(201).json({ message: "Registration successful ✅" });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`[Login] Attempt for: ${email}`);

        // Find student in MongoDB (Source of truth for auth)
        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: "Invalid email or password ❌" });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password ❌" });
        }

        // Fetch MySQL ID to match frontend's expectation of data.student.id
        const [sqlRows] = await mysqlPool.query("SELECT id FROM students WHERE email = ?", [email]);
        const sqlId = sqlRows.length > 0 ? sqlRows[0].id : null;

        console.log(`✅ Login successful for: ${email}`);
        res.json({
            message: "Login successful ✅",
            student: {
                id: student._id, // Mongo ID
                mysqlId: sqlId,  // Keep for legacy sync
                fullName: student.fullName,
                email: student.email,
                domain: student.domain,
                testCompleted: student.testCompleted
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error during login" });
    }
};

export const incrementResumeCount = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email required" });
        console.log(`[Resume] Incrementing count for: ${email}`);

        await mysqlPool.query("UPDATE students SET resumeCreatedCount = resumeCreatedCount + 1 WHERE email = ?", [email]);
        await Student.findOneAndUpdate({ email }, { $inc: { resumeCreatedCount: 1 } });

        res.json({ message: "Resume count incremented ✅" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getFeedback = async (req, res) => {
    try {
        const [rows] = await mysqlPool.query("SELECT * FROM student_feedback ORDER BY created_at DESC LIMIT 10");
        // Map MySQL rows to frontend expected format if needed (frontend expects studentName, rating, comment)
        // MySQL has student_name, comment, rating.
        const feedbacks = rows.map(row => ({
            studentName: row.student_name,
            comment: row.comment,
            rating: row.rating,
            createdAt: row.created_at
        }));
        res.json(feedbacks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const postFeedback = async (req, res) => {
    try {
        const { studentId, email, feedbackText, rating } = req.body;
        // console.log("DEBUG: postFeedback", req.body);

        let mySqlStudentId = null;
        let studentName = "Unknown Student";

        // --- 1. SYNC: Ensure Student Exists in MySQL ---
        // Try getting email from Mongo if not provided
        let targetEmail = email;
        if (!targetEmail && studentId) {
            const mongoStudent = await Student.findById(studentId);
            if (mongoStudent) targetEmail = mongoStudent.email;
        }

        if (targetEmail) {
            // Check MySQL
            const [rows] = await mysqlPool.query("SELECT id, fullName FROM students WHERE email = ?", [targetEmail]);
            if (rows.length > 0) {
                mySqlStudentId = rows[0].id;
                studentName = rows[0].fullName;
            } else {
                // Not in MySQL? (Rare if flow is correct, but possible for test-only users)
                // Fetch details from Mongo to Insert
                const ms = await Student.findById(studentId);
                if (ms) {
                    const [ins] = await mysqlPool.query(
                        "INSERT INTO students (fullName, email, mobile) VALUES (?, ?, ?)",
                        [ms.name, ms.email, ms.phone]
                    );
                    mySqlStudentId = ins.insertId;
                    studentName = ms.name;
                }
            }
        }

        if (!mySqlStudentId) {
            // Fallback: If we still can't find a MySQL ID, we can't insert due to FK.
            // But to prevent crash, maybe try one last lookup by generic logic
            return res.status(400).json({ error: "Student record not found. Please log in again." });
        }

        // --- 2. Insert Feedback ---
        await mysqlPool.query(
            "INSERT INTO student_feedback (student_id, student_name, rating, comment) VALUES (?, ?, ?, ?)",
            [mySqlStudentId, studentName, rating, feedbackText]
        );

        // --- 3. Increment Counter ---
        await mysqlPool.query("UPDATE students SET feedbackCount = feedbackCount + 1 WHERE id = ?", [mySqlStudentId]);
        if (studentId) {
            await Student.findByIdAndUpdate(studentId, { $inc: { feedbackCount: 1 } });
        }

        // ✅ AUTO-SEND FEEDBACK NOTIFICATION
        try {
            const { sendMail } = await import("../utils/mailer.js");
            const adminEmail = process.env.ADMIN_EMAIL || "admin@careercredentials.com";

            // 1. Send Ack to Student
            await sendMail({
                to: targetEmail,
                subject: "Thank You for Your Feedback - Career Credentials",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2 style="color: #2b6cb0;">Thank You, ${studentName}!</h2>
                        <p>We received your feedback.</p>
                        <p><strong>Rating:</strong> ${rating}/5 ⭐</p>
                        <p><strong>Comment:</strong> <em>"${feedbackText}"</em></p>
                        <p>Your input helps us improve our guidance platform.</p>
                        <br/>
                        <p>Best Regards,<br/><strong>Career Credentials Team</strong></p>
                    </div>
                `
            });

            // 2. Send Alert to Admin
            await sendMail({
                to: adminEmail,
                subject: `📢 New Feedback Received: ${studentName}`,
                html: `
                    <h3>New Feedback Submission</h3>
                    <p><strong>From:</strong> ${studentName} (${targetEmail})</p>
                    <p><strong>Rating:</strong> ${rating}/5</p>
                    <p><strong>Comment:</strong> ${feedbackText}</p>
                `
            });
        } catch (mailErr) {
            console.error("❌ Notification mail failed:", mailErr.message);
        }

        res.status(201).json({ message: "Feedback submitted successfully" });
    } catch (err) {
        console.error("postFeedback Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const checkTestEligibility = async (req, res) => {
    try {
        const { studentId } = req.params;
        if (!studentId || studentId === "undefined") {
            return res.json({ canTakeTest: true });
        }

        const student = await Student.findById(studentId);
        if (!student) return res.json({ canTakeTest: true });

        // If they haven't completed a test, or testAttempts == 0
        const canTake = !student.testCompleted || student.testAttempts === 0;
        res.json({ canTakeTest: canTake });
    } catch (err) {
        res.json({ canTakeTest: true, error: err.message });
    }
};

export const submitRetestRequest = async (req, res) => {
    try {
        const { studentId, reason } = req.body;
        if (!studentId || !reason) {
            return res.status(400).json({ error: "studentId and reason are required" });
        }

        console.log(`[Retest] Request from ${studentId}: ${reason}`);

        // 1. Sync with MySQL retest_requests (Create table if not exists for resilience)
        await mysqlPool.query(`
            CREATE TABLE IF NOT EXISTS retest_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                student_id VARCHAR(255),
                reason TEXT,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await mysqlPool.query(
            "INSERT INTO retest_requests (student_id, reason) VALUES (?, ?)",
            [studentId, reason]
        );

        res.json({ success: true, message: "Retest request submitted successfully ✅" });
    } catch (err) {
        console.error("Retest Request Error:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
};

export const saveResult = async (req, res) => {
    try {
        const { student_id, primary_language, recommended_career, strongest_domain, systems_score, enterprise_score, automation_score, intelligence_score } = req.body;

        if (!student_id) return res.status(400).json({ error: "Student ID is required" });

        console.log(`Processing test result for student: ${student_id}`);

        // 1. Update MongoDB
        const updatedStudent = await Student.findByIdAndUpdate(
            student_id,
            {
                domain: strongest_domain,
                testCompleted: true,
                $inc: { testAttempts: 1 }
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found in MongoDB" });
        }

        // 2. MySQL Sync
        const email = updatedStudent.email || updatedStudent.name; // Fallback to name if email is somehow missing

        // Ensure student exists in MySQL or Update
        await mysqlPool.query(
            "UPDATE students SET domain = ?, testCompleted = TRUE, testAttempts = testAttempts + 1 WHERE email = ?",
            [strongest_domain, email]
        );

        // 3. Save to detailed test_results table
        // Use mysqlPool instead of raw db for consistency
        const testSql = `
            INSERT INTO test_results 
            (student_id, systems, enterprise, automation, intelligence, primary_language, career) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await mysqlPool.query(testSql, [
            student_id,
            systems_score, enterprise_score, automation_score, intelligence_score,
            primary_language, recommended_career
        ]);

        console.log("✅ Test saved successfully");
        console.log("Domain assigned:", strongest_domain);

        res.json({
            message: "Result saved and domain mapped ✅",
            domain: strongest_domain,
            student: updatedStudent
        });
    } catch (err) {
        console.error("❌ saveResult Error:", err);
        res.status(500).json({ error: "Server error during sync: " + err.message });
    }
};

export const getRecordedSessions = async (req, res) => {
    try {
        const { studentId } = req.params;
        let domain = "General";

        // Try to find the student in MySQL first to get the most up-to-date domain
        const [studentRows] = await mysqlPool.query("SELECT domain FROM students WHERE id = ?", [studentId]);
        if (studentRows.length > 0) {
            domain = studentRows[0].domain || "General";
        } else {
            // Fallback to Mongo if not in MySQL
            try {
                const student = await Student.findById(studentId);
                if (student) domain = student.domain || "General";
            } catch (e) {
                console.log("RecordedSessions: Mongo fallback failed:", e.message);
            }
        }

        // Fetch videos matching the domain strictly
        const [domainVideos] = await mysqlPool.query("SELECT * FROM recorded_sessions WHERE domain = ?", [domain]);

        if (domainVideos.length > 0) {
            // Sort them by title alphabetically
            const sorted = [...domainVideos].sort((a, b) => a.title.localeCompare(b.title));
            return res.json({ domain: domain, videos: sorted });
        } else {
            // ABSOLUTE FALLBACK: The specific random video provided by user
            // https://youtu.be/KfNrHZUH3WU?si=5QtDtxKZTUks6SLx
            const fallbackVideo = {
                id: 'fallback-random',
                title: "Master Your Technical Career",
                youtubeLink: "KfNrHZUH3WU",
                domain: domain,
                description: "A comprehensive guide to mastering your domain and cracking technical interviews with expert insights."
            };
            return res.json({ domain: domain, videos: [fallbackVideo] });
        }
    } catch (err) {
        console.error("RecordedSessions Fatal Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getAllRecordedSessions = async (req, res) => {
    try {
        const [videos] = await mysqlPool.query("SELECT * FROM recorded_sessions");

        // Sort by domain then title
        const sortedVideos = [...videos].sort((a, b) => {
            if (a.domain < b.domain) return -1;
            if (a.domain > b.domain) return 1;
            if (a.title < b.title) return -1;
            if (a.title > b.title) return 1;
            return 0;
        });

        res.json({ domain: "All Sessions", videos: sortedVideos });
    } catch (err) {
        console.error("AllRecordedSessions Fatal Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getBooks = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Fetch all books
        const [allBooks] = await mysqlPool.query("SELECT * FROM books ORDER BY id DESC");

        // Fetch read history for this student
        const student = await Student.findById(studentId);
        let mySqlId = null;
        if (student) {
            const [rows] = await mysqlPool.query("SELECT id FROM students WHERE email = ?", [student.email]);
            if (rows.length > 0) mySqlId = rows[0].id;
        }

        let readIds = [];
        if (mySqlId) {
            const [history] = await mysqlPool.query("SELECT book_id FROM student_book_history WHERE student_id = ? AND isRead = TRUE", [mySqlId]);
            readIds = history.map(h => h.book_id);
        }

        // Reorder logic: Unread first, Read last
        const processed = allBooks.map(book => ({
            ...book,
            isRead: readIds.includes(book.id)
        })).sort((a, b) => (a.isRead === b.isRead ? 0 : a.isRead ? 1 : -1));

        res.json(processed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const trackBookRead = async (req, res) => {
    try {
        const { studentId, bookId, title } = req.body;
        if (!studentId || !bookId) return res.status(400).json({ error: "Missing data" });

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // 1. Mark as read in MySQL History
        const [rows] = await mysqlPool.query("SELECT id FROM students WHERE email = ?", [student.email]);
        if (rows.length > 0) {
            const mySqlId = rows[0].id;
            await mysqlPool.query(
                "INSERT INTO student_book_history (student_id, book_id, isRead, readAt) VALUES (?, ?, TRUE, NOW()) ON DUPLICATE KEY UPDATE isRead = TRUE, readAt = NOW()",
                [mySqlId, bookId]
            );
            await mysqlPool.query("UPDATE students SET bookReadCount = bookReadCount + 1 WHERE id = ?", [mySqlId]);
        }

        // 2. Update MongoDB
        const alreadyRead = student.readBooks.some(b => b.bookId === bookId);
        if (!alreadyRead) {
            await Student.findByIdAndUpdate(studentId, {
                $inc: { bookReadCount: 1 },
                $push: { readBooks: { bookId, title, readAt: new Date() } }
            });
        }

        res.json({ message: "Book tracked successfully ✅" });
    } catch (err) {
        console.error("trackBookRead Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const syncCounts = async (req, res) => {
    try {
        const { email } = req.params;
        console.log(`[Sync] Requesting counts for email: ${email}`);

        // 1. Fetch from MongoDB
        const mongoStudent = await Student.findOne({ email });
        console.log(`[Sync] Mongo Result: ${mongoStudent ? 'Found' : 'Not Found'}`);

        // 2. Fetch from MySQL
        const [mysqlRows] = await mysqlPool.query(
            "SELECT domain, bookReadCount, feedbackCount, meetingCount, resumeCreatedCount, testCompleted FROM students WHERE email = ?",
            [email]
        );
        console.log(`[Sync] MySQL Result: ${mysqlRows.length > 0 ? 'Found' : 'Not Found'}`);

        if (!mongoStudent && mysqlRows.length === 0) {
            console.log(`[Sync] 404: Student ${email} not found in any DB`);
            return res.status(404).json({ error: "Student not found in any database" });
        }

        const mysqlData = mysqlRows.length > 0 ? mysqlRows[0] : {};

        const mergedData = {
            email: email,
            domain: mongoStudent?.domain || mysqlData.domain || "General",
            testCompleted: !!(mongoStudent?.testCompleted || mysqlData.testCompleted),
            bookReadCount: mongoStudent?.bookReadCount || mysqlData.bookReadCount || 0,
            feedbackCount: mongoStudent?.feedbackCount || mysqlData.feedbackCount || 0,
            meetingCount: mongoStudent?.meetingCount || mysqlData.meetingCount || 0,
            resumeCreatedCount: mongoStudent?.resumeCreatedCount || mysqlData.resumeCreatedCount || 0
        };

        if (mongoStudent?.domain && !mysqlData.domain) {
            try {
                console.log(`[Sync] Updating MySQL domain for ${email}`);
                await mysqlPool.query("UPDATE students SET domain = ? WHERE email = ?", [mongoStudent.domain, email]);
            } catch (updErr) {
                console.error("[Sync] Domain Sync Failed:", updErr.message);
            }
        }

        console.log(`[Sync] 200: Successfully merged data for ${email}`);
        res.json(mergedData);
    } catch (err) {
        console.error("❌ syncCounts FATAL ERROR:", err);
        res.status(500).json({ error: "Internal server sync error: " + err.message });
    }
};

export const incrementMeetingCount = async (req, res) => {
    try {
        const { email } = req.body;
        await mysqlPool.query("UPDATE students SET meetingCount = meetingCount + 1 WHERE email = ?", [email]);
        await Student.findOneAndUpdate({ email }, { $inc: { meetingCount: 1 } });
        res.json({ message: "Meeting count incremented" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Existing logic remains below if not replaced...
export const submitTest = async (req, res) => {
    try {
        const { name, email, phone, careerInterest } = req.body;
        let student = await Student.findOne({ email });
        if (student) {
            student.name = name;
            student.phone = phone;
            student.careerInterest = careerInterest;
            student.testCompleted = true;
            await student.save();
        } else {
            student = await Student.create({ name, email, phone, careerInterest, testCompleted: true });
        }
        res.status(201).json({ student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getResult = async (req, res) => {
    try {
        const { studentId } = req.query;
        const student = await Student.findById(studentId);
        res.json({ interest: student?.careerInterest || "Software Development" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


