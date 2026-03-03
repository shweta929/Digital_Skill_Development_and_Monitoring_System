import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/Student.js";
import Meeting from "./models/Meeting.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/careerMeetDB")
    .then(async () => {
        console.log("Connected to DB...");
        const email = "durva0977@gmail.com";

        const student = await Student.findOne({ email });
        if (student) {
            const result = await Meeting.deleteMany({ studentId: student._id });
            console.log(`✅ Cleared ${result.deletedCount} meeting(s) for ${email}`);
        } else {
            console.log(`⚠️ Student with email ${email} not found.`);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
