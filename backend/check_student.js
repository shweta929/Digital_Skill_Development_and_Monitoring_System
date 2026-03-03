import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/Student.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/careerMeetDB")
    .then(async () => {
        console.log("Connected to DB...");
        const email = "durva0977@gmail.com";

        const student = await Student.findOne({ email });
        if (student) {
            console.log("✅ Student Found:");
            console.log(student);
        } else {
            console.log("❌ Student NOT Found for email:", email);
        }
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
