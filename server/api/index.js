// server/index.js
import dotenv from "dotenv";
dotenv.config(); // <-- MUST be first (before other imports that use env vars)

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";

// quick debug checks (remove after verifying)
console.log("ENV CLOUD_NAME:", !!process.env.CLOUD_NAME ? "SET" : "MISSING");
console.log("ENV CLOUD_KEY:", !!process.env.CLOUD_KEY ? "SET" : "MISSING");
console.log("ENV CLOUD_SECRET:", !!process.env.CLOUD_SECRET ? "SET" : "MISSING");
console.log("ENV PORT:", process.env.PORT || "(not set, using default)");


// --- DB CONNECT ---
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Error:", err));

const app = express();

// --- CORS (VERY IMPORTANT) ---
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// --- ROUTES ---
app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

export default app;
