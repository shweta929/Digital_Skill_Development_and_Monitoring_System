import nodemailer from "nodemailer";
import dotenv from "dotenv";
import dns from "dns";

dotenv.config();
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
});

// transporter.verify((err, success) => {
//     if (err) console.log("SMTP VERIFY ERROR:", err);
//     else console.log("✅ SMTP Server Ready");
// });

export async function sendMail({ to, subject, html, attachments = [], headers = {} }) {
    return transporter.sendMail({
        from: `${process.env.APP_NAME || "Career Guidance Portal"} <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
        attachments,
        headers,
    });
}
