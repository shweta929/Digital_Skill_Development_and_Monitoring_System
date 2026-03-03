import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173", // Vite default
        credentials: true,
    })
);

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "careerportal_secret",
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // localhost = false
            httpOnly: true,
        },
    })
);


console.log("🚀 Starting Career Credentials Backend...");

connectDB().then(async () => {
    console.log("✅ Database Ready. Loading Routes...");

    try {
        // Dynamic imports for ALL routes to prevent blocking startup
        console.log("📦 Importing route modules...");
        const [
            { default: trainerRoutes },
            { default: meetingRoutes },
            { default: studentRoutes },
            { default: adminRoutes },
            { default: googleAuthRoutes }
        ] = await Promise.all([
            import("./routes/trainerRoutes.js"),
            import("./routes/meetingRoutes.js"),
            import("./routes/studentRoutes.js"),
            import("./routes/adminRoutes.js"),
            import("./routes/googleAuthRoutes.js")
        ]);

        console.log("✅ Route modules imported successfully");
        console.log("🔗 Registering routes with Express app...");

        app.use("/api/trainers", trainerRoutes);
        console.log("  ✓ Trainer routes registered");

        app.use("/api/meetings", meetingRoutes);
        console.log("  ✓ Meeting routes registered");

        app.use("/api/students", studentRoutes);
        console.log("  ✓ Student routes registered");

        app.use("/api/admin", adminRoutes);
        console.log("  ✓ Admin routes registered");

        app.use("/auth", googleAuthRoutes);
        console.log("  ✓ Google auth routes registered");

        const PORT = process.env.PORT || 5001;
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log("Ready for 1v1 Meetings and CRM updates.");
        });
    } catch (routeError) {
        console.error("❌ Error loading routes:", routeError);
        console.error("Stack trace:", routeError.stack);
        process.exit(1);
    }
}).catch(err => {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
});
