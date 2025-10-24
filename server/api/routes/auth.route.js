// 1. Import the express library
import express from 'express';

// 2. Import the controller function (the "chef")
// We have not created this file yet, but we will next
import { signup } from '../controllers/auth.controller.js';

// 3. Create a new router
const router = express.Router();

// 4. Define the signup route
// When a POST request hits '/signup', call the 'signup' function
router.post('/signup', signup);

// 5. Export the router for the main app to use
export default router;

