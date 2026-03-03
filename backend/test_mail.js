
import dotenv from 'dotenv';
import { sendMail } from './utils/mailer.js';

dotenv.config();

const testEmail = async () => {
    try {
        console.log("📧 Testing Email Sending...");
        console.log("User:", process.env.EMAIL_USER);

        await sendMail({
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: "Test Email from Admin Console",
            html: "<h3>It works!</h3><p>This is a test email to verify the mailer configuration.</p>"
        });

        console.log("✅ Email sent successfully!");
    } catch (err) {
        console.error("❌ Email failed:", err);
    }
};

testEmail();
