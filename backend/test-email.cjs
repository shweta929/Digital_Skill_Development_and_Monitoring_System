const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function test() {
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.verify();
        console.log("✅ Authenticated successfully");
    } catch (err) {
        console.error("❌ Auth failed:", err);
    }
    process.exit(0);
}
test();
