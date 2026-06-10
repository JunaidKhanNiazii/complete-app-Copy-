require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { db } = require("./config/firebase");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const memberRoutes = require("./routes/memberRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const aiRoutes = require("./routes/aiRoutes");
const levelRoutes = require("./routes/levelRoutes");

if (!process.env.GITHUB_TOKEN) {
    console.warn("⚠️ WARNING: GITHUB_TOKEN is not defined in .env! GitHub uploads will fail.");
} else {
    console.log("✅ GITHUB_TOKEN is loaded (Masked: " + process.env.GITHUB_TOKEN.substring(0, 4) + "****)");
}

/* -------------------- ROUTES -------------------- */

// Auth routes (Registration)
app.use("/", authRoutes);

// User routes (Management)
app.use("/users", userRoutes);

// Admin routes (Authentication & Dashboard)
app.use("/admin", adminRoutes);

// Member routes (Authentication & Profile)
app.use("/member", memberRoutes);

// Workout routes (Workout tracking)
app.use("/workouts", workoutRoutes);

// Feedback routes (User feedback)
app.use("/feedback", feedbackRoutes);

// AI Assistant routes (Fitness chatbot)
app.use("/ai", aiRoutes);

// Level routes (Gamification system)
app.use("/", levelRoutes);

/* -------------------- START SERVER -------------------- */

const os = require('os');
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
};

app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📱 Network access: http://${localIP}:${PORT}`);

    // Status report to show the server is alive
    setInterval(() => {
        console.log(`✨ [${new Date().toLocaleTimeString()}] FitZone Backend is ONLINE and Listening...`);
    }, 15000);
});

// Global error handlers to catch silent crashes
process.on('uncaughtException', (err) => {
    console.error('🔥 UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🔥 UNHANDLED REJECTION at:', promise, 'reason:', reason);
});