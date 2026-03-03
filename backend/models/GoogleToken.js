import mongoose from "mongoose";

const GoogleTokenSchema = new mongoose.Schema(
    {
        email: { type: String, required: true, unique: true },
        tokens: { type: Object, required: true },
    },
    { timestamps: true }
);

export default mongoose.model("GoogleToken", GoogleTokenSchema);
