import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema(
    {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        studentName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        isPublic: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
