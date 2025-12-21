// server/index.js
import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import userRouter from "./routes/user.route.js";

// 🔍 ENV sanity check (keep during debugging)
console.log("ENV CLOUD_NAME:", process.env.CLOUD_NAME ? "SET" : "MISSING");
console.log("ENV CLOUD_KEY:", process.env.CLOUD_KEY ? "SET" : "MISSING");
console.log("ENV CLOUD_SECRET:", process.env.CLOUD_SECRET ? "SET" : "MISSING");
console.log("ENV PORT:", process.env.PORT || "10000");

// --- DATABASE CONNECTION ---
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

const app = express();

// --- CORS CONFIGURATION ---
const allowedOrigins = [
    "http://localhost:5173",                 // local frontend
    "https://your-frontend-domain.vercel.app" // 🔴 replace later when deployed
];

app.use(
    cors({
        origin: function (origin, callback) {
            // allow server-to-server or REST tools
            if (!origin) return callback(null, true);

            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // allow cookies
    })
);

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cookieParser());

// --- ROUTES ---
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use("/api/users", userRouter);

// --- START SERVER ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
