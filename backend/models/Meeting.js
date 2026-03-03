import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
    {
        eventId: { type: String, default: "" },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        requestedDate: { type: String },
        finalDate: { type: String },
        meetLink: { type: String },
        status: { type: String, default: "Pending" },
        note: { type: String }
    },
    { timestamps: true }
);

const Meeting = mongoose.model("Meeting", MeetingSchema);
export default Meeting;
