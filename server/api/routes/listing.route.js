// server/api/routes/listing.route.js
import express from "express";
import upload from "../utils/multer.js";
import authenticate from "../middleware/auth.middleware.js";
import {
    createListing,
    getListings,
    getListingById
} from "../controllers/listing.controller.js";

const router = express.Router();

// CREATE LISTING
// POST /api/listings/create
router.post("/create", authenticate, upload.single("image"), createListing);

// GET ALL LISTINGS
// GET /api/listings
router.get("/", getListings);

// GET SINGLE LISTING
// GET /api/listings/:id
router.get("/:id", getListingById);

export default router;
