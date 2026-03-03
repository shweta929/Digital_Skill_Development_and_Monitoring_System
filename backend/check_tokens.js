
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function checkTokens() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB:", process.env.MONGO_URI);

        const tokenSchema = new mongoose.Schema({ email: String }, { strict: false });
        const GoogleToken = mongoose.model("GoogleToken", tokenSchema);

        const adminEmail = process.env.ADMIN_EMAIL;
        console.log("Checking token for Admin Email:", adminEmail);

        const token = await GoogleToken.findOne({ email: adminEmail });

        if (token) {
            console.log("✅ Token FOUND for", adminEmail);
        } else {
            console.log("❌ Token NOT FOUND for", adminEmail);

            // List all tokens to see if there's a mismatch
            const allTokens = await GoogleToken.find({});
            console.log("Authorized Emails found in DB:", allTokens.map(t => t.email));
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}
checkTokens();
