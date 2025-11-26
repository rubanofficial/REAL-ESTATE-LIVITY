// server/api/routes/listing.route.js
import express from "express";
import upload from "../utils/multer.js";
import authenticate from "../middleware/auth.middleware.js";
import { createListing } from "../controllers/listing.controller.js";

const router = express.Router();

// POST /api/listings/create
router.post("/create", authenticate, upload.single("image"), createListing);

export default router;
