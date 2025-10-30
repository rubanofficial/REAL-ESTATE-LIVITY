// --- 1. Imports ---
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors'; // ✅ Important if frontend and backend run on different ports
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
// --- 2. Initial Setup ---
dotenv.config();

// --- 3. Database Connection ---
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ Successfully connected to MongoDB!');
    })
    .catch((err) => {
        console.error('❌ Failed to connect to MongoDB:', err);
    });

// --- 4. Create the Express App ---
const app = express();

// --- 5. Middlewares ---
app.use(cors()); // ✅ allows frontend (5173) to talk to backend (5000)
app.use(express.json()); // ✅ parses incoming JSON requests
app.use(cookieParser());
// --- 6. Define API Routes ---
app.use('/api/auth', authRouter);

// --- 7. Start the Server (for local development) ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// --- 8. Export for Vercel (optional, won’t affect local run) ---
export default app;
