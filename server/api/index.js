
import express from 'express';
// Mongoose is our tool for working with the MongoDB database.
import mongoose from 'mongoose';
// Dotenv loads our secret keys (like the database password) from the .env file.
import dotenv from 'dotenv';
// We import our first "waiter", the authentication router.
import authRouter from './routes/auth.route.js';

// --- 2. Initial Setup ---
// Load the variables from our .env file into the application.
dotenv.config();

// --- 3. Database Connection ---
// We use Mongoose to connect to the MongoDB Atlas database.
// process.env.MONGO_URI pulls the secret connection string from your .env file.
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Successfully connected to MongoDB! ');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// --- 4. Create the Express App ---
const app = express();

// This is a crucial middleware. It allows our server to accept and parse
// JSON data sent from the frontend (e.g., from our signup form).
app.use(express.json());

// --- 5. Define the API Routes ---
// The manager tells the waiter their station.
// Any URL that starts with '/api/auth' will be handled by our 'authRouter'.
app.use('/api/auth', authRouter);

// --- 6. Export the App for Vercel ---
// This is required for Vercel's serverless environment.
export default app;