import { google } from "googleapis";
import GoogleToken from "../models/GoogleToken.js";
import dotenv from "dotenv";
dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export const googleAuthStart = async (req, res) => {
    const scopes = [
        "https://www.googleapis.com/auth/calendar",
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });

    res.redirect(url);
};

export const googleAuthCallback = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) return res.status(400).send("❌ No code received");

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const adminEmail = process.env.ADMIN_EMAIL;

        if (!adminEmail) {
            return res.status(500).send("❌ ADMIN_EMAIL is missing in .env");
        }

        await GoogleToken.findOneAndUpdate(
            { email: adminEmail },
            { tokens },
            { upsert: true, new: true }
        );

        res.send("✅ Google Calendar Connected Successfully! You can close this tab.");
    } catch (err) {
        console.error("googleAuthCallback error:", err.message);
        res.status(500).send("❌ Google Auth Failed: " + err.message);
    }
};

export const googleAuthStatus = async (req, res) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        const saved = await GoogleToken.findOne({ email: adminEmail });

        if (!saved) {
            return res.json({ connected: false });
        }
        return res.json({ connected: true });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
