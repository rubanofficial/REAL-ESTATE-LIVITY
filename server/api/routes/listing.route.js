// Listing routes for CRUD and map-optimized endpoints.
import express from "express";
import upload from "../utils/multer.js";
import authenticate from "../middleware/auth.middleware.js";
import {
    createListing,
    getListings,
    getMapListings,
    getListingById,
    markInterested,
} from "../controllers/listing.controller.js";

const router = express.Router();

/**
 * CREATE LISTING
 * POST /api/listings/create
 */
router.post(
    "/create",
    authenticate,
    upload.single("image"),
    createListing
);

/**
 * GET ALL LISTINGS
 * GET /api/listings
 */
router.get("/", getListings);

/**
 * GET MAP LISTINGS
 * GET /api/listings/map
 */
router.get("/map", getMapListings);

/**
 * GET SINGLE LISTING
 * GET /api/listings/:id
 */
router.get("/:id", getListingById);

/**
 * CONTACT SELLER
 * POST /api/listings/:id/interested
 */
router.post(
    "/:id/interested",
    authenticate,
    markInterested
);

export default router;
