import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String, default: "" }, // Keep legacy phone for safety
        mobile: { type: String, default: "" },
        gender: { type: String, default: "" },
        dob: { type: String, default: "" },
        address: { type: String, default: "" },

        education: { type: String, default: "" },
        experienceYears: { type: Number, default: 0 },
        goal: { type: String, default: "Job ready in 3 months" },

        degreeStatus: {
            type: String,
            enum: ["Completed", "Pursuing"],
            default: "Pursuing",
        },

        degreeCompletionDate: { type: String, default: "" },

        selectedCourse: { type: String, default: "Java" },

        testCompleted: { type: Boolean, default: false },
        testAttempts: { type: Number, default: 0 },
        careerInterest: { type: String, default: "" },

        // New Enhanced Fields
        domain: { type: String, default: "" },
        bookReadCount: { type: Number, default: 0 },
        readBooks: [{
            bookId: String,
            title: String,
            readAt: { type: Date, default: Date.now }
        }],
        feedbackCount: { type: Number, default: 0 },
        meetingCount: { type: Number, default: 0 },
        resumeCreatedCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Student", StudentSchema);
