// ===================================================================
// 🚀 LISTING CONTROLLER - ADVANCED SEARCH ENGINE
// ===================================================================
// This controller implements a production-level search system with:
// - Dynamic filtering
// - Text search optimization
// - Query building
// - Efficient MongoDB queries
// ===================================================================

import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { uploadBufferToCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * 🔍 BUILD ADVANCED SEARCH QUERY
 * 
 * This function is the HEART of the search engine.
 * It dynamically constructs a MongoDB query based on user filters.
 * 
 * Key principle: Only add filters that were provided by the user
 * 
 * @param {object} queryParams - req.query object from Express
 * @returns {object} MongoDB query object ready for .find()
 */
function buildSearchQuery(queryParams = {}) {
    const query = {};

    // ========================================
    // 1️⃣ TEXT SEARCH (keyword search)
    // ========================================
    // If user provides a search keyword, use MongoDB text index
    // Text search is MUCH faster than $regex for large datasets
    if (queryParams.search && queryParams.search.trim()) {
        // $text operator searches the text index (title + description)
        query.$text = { $search: queryParams.search.trim() };
    }

    // ========================================
    // 2️⃣ CITY FILTER (partial match, case-insensitive)
    // ========================================
    // Users often search by city name
    // Using case-insensitive regex is acceptable here because
    // we have an index on address.city
    if (queryParams.city && queryParams.city.trim()) {
        query["address.city"] = {
            $regex: queryParams.city.trim(),
            $options: "i", // i = case-insensitive
        };
    }

    // ========================================
    // 3️⃣ TYPE FILTER (exact match: sale or rent)
    // ========================================
    // Type is an enum and should match exactly
    // This filter is VERY fast because of the index
    if (queryParams.type) {
        const validTypes = ["sale", "rent"];
        if (validTypes.includes(queryParams.type.toLowerCase())) {
            query.type = queryParams.type.toLowerCase();
        }
        // If invalid type is passed, we silently ignore it
    }

    // ========================================
    // 4️⃣ PRICE RANGE FILTER (between minPrice and maxPrice)
    // ========================================
    // Users filter by budget
    // MongoDB range operators ($gte, $lte) are very efficient with price index
    const minPrice = queryParams.minPrice ? Number(queryParams.minPrice) : null;
    const maxPrice = queryParams.maxPrice ? Number(queryParams.maxPrice) : null;

    // Only add price filter if at least one bound is valid
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice && minPrice > 0) {
            query.price.$gte = minPrice; // $gte = greater than or equal
        }
        if (maxPrice && maxPrice > 0) {
            query.price.$lte = maxPrice; // $lte = less than or equal
        }
    }

    // ========================================
    // 5️⃣ FURNISHED FILTER (optional)
    // ========================================
    // Only apply if explicitly requested
    if (queryParams.furnished !== undefined) {
        query.furnished = queryParams.furnished === "true" || queryParams.furnished === true;
    }

    // ========================================
    // RETURN: Complete MongoDB query object
    // ========================================
    // This object will be passed to Listing.find(query)
    // MongoDB will use indexes to execute this efficiently
    return query;
}

/**
 * 🧮 HELPER: Validate and parse pagination params
 * 
 * @param {string} pageStr - page number as string (from req.query)
 * @param {string} limitStr - limit as string (from req.query)
 * @returns {object} {page, limit, skip}
 */
function getPaginationParams(pageStr, limitStr) {
    let page = Number(pageStr) || 1;
    let limit = Number(limitStr) || 10;

    // Safety: ensure page is at least 1
    page = Math.max(1, page);

    // Safety: enforce reasonable limits (max 100 per page)
    limit = Math.min(100, Math.max(1, limit));

    // skip = how many documents to skip
    // Page 1, limit 10 → skip 0 docs (docs 1-10)
    // Page 2, limit 10 → skip 10 docs (docs 11-20)
    const skip = (page - 1) * limit;

    return { page, limit, skip };
}

/**
 * 🔤 BUILD SORT OBJECT
 * 
 * Converts user-friendly sort strings into MongoDB sort syntax
 * 
 * SORT OPTIONS:
 * - price_asc     → { price: 1 }         (cheapest first)
 * - price_desc    → { price: -1 }        (most expensive first)
 * - newest        → { createdAt: -1 }    (latest first)
 * - oldest        → { createdAt: 1 }     (oldest first)
 * 
 * Default: newest (most recent listings first)
 * 
 * @param {string} sortParam - sort parameter from req.query
 * @returns {object} MongoDB sort object
 */
function buildSortObject(sortParam) {
    // Map of user-friendly sort strings to MongoDB sort objects
    const sortOptions = {
        price_asc: { price: 1 },      // Low to high
        price_desc: { price: -1 },    // High to low
        newest: { createdAt: -1 },    // Latest first
        oldest: { createdAt: 1 },     // Oldest first
    };

    // If sortParam is valid, use it; otherwise default to newest
    if (sortParam && sortOptions[sortParam]) {
        return sortOptions[sortParam];
    }

    // DEFAULT: Sort by creation date descending (newest first)
    return { createdAt: -1 };
}

/**
 * CREATE LISTING
 * POST /api/listings/create
 */
/**
 * Create a new listing with image upload and optional location.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createListing(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Image (field 'image') is required",
            });
        }

        const {
            title = "",
            description = "",
            price,
            currency = "INR",
            type = "sale",
            bedrooms = 1,
            bathrooms = 1,
            areaSqFt = 0,
            address,
            location,
        } = req.body;

        if (!title.trim()) {
            return res.status(400).json({ message: "Title required" });
        }

        if (!price || Number(price) <= 0) {
            return res.status(400).json({ message: "Valid price required" });
        }

        let addressObj = {};
        if (address) {
            try {
                addressObj =
                    typeof address === "string" ? JSON.parse(address) : address;
            } catch {
                return res
                    .status(400)
                    .json({ message: "Address must be valid JSON" });
            }
        }

        let locationObj = null;
        if (location) {
            try {
                const parsed =
                    typeof location === "string" ? JSON.parse(location) : location;
                if (
                    typeof parsed?.lat === "number" &&
                    typeof parsed?.lng === "number"
                ) {
                    locationObj = { lat: parsed.lat, lng: parsed.lng };
                }
            } catch {
                return res
                    .status(400)
                    .json({ message: "Location must be valid JSON" });
            }
        }

        const uploadResult = await uploadBufferToCloudinary(
            req.file.buffer,
            "rems_listings"
        );

        const listing = await Listing.create({
            title: title.trim(),
            description,
            price: Number(price),
            currency,
            type,
            furnished:
                req.body.furnished === "true" ||
                req.body.furnished === true,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            areaSqFt: Number(areaSqFt),
            address: addressObj,
            location: locationObj,
            image: {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            },
            images: [
                {
                    url: uploadResult.url,
                    public_id: uploadResult.public_id,
                },
            ],
            owner: req.user._id,
        });

        return res.status(201).json({ property: listing });
    } catch (err) {
        console.error("createListing error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}


/**
 * ✅ GET ALL LISTINGS (ADVANCED SEARCH)
 * GET /api/listings
 * 
 * Query params:
 *   ?search=keyword&city=Chennai&type=sale&minPrice=10000&maxPrice=5000000&page=1&limit=10&sort=price_asc
 * 
 * Returns paginated results with metadata
 */
export async function getListings(req, res) {
    try {
        // Step 1: Build the MongoDB query dynamically
        const query = buildSearchQuery(req.query);

        // Step 2: Get pagination params
        const { page, limit, skip } = getPaginationParams(
            req.query.page,
            req.query.limit
        );

        // Step 3: Build sort object based on user preference
        const sortObject = buildSortObject(req.query.sort);

        // Step 4: Execute TWO queries in parallel for efficiency
        // Query 1: Get the paginated results
        // Query 2: Count total documents (for pagination info)
        const [listings, totalCount] = await Promise.all([
            Listing.find(query)
                .skip(skip)
                .limit(limit)
                .sort(sortObject) // 🆕 Apply user's sort preference
                .lean(), // .lean() returns plain JS objects (faster than Mongoose docs)
            Listing.countDocuments(query), // Count matching documents
        ]);

        // Step 5: Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);

        // Step 6: Return structured response
        return res.status(200).json({
            success: true,
            listings,
            pagination: {
                currentPage: page,
                totalPages,
                totalListings: totalCount,
                itemsPerPage: limit,
            },
            sortedBy: req.query.sort || "newest", // 🆕 Echo back the sort used
            message: `Found ${totalCount} listings`,
        });
    } catch (err) {
        console.error("getListings error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching listings",
        });
    }
}



/**
 * ✅ GET MAP LISTINGS (LIGHTWEIGHT)
 * GET /api/listings/map
 * 
 * Same filters as getListings, but returns only minimal data for map display
 * (no description, no full address — just coords + image + price)
 * 
 * Returns up to 200 markers for performance
 */
export async function getMapListings(req, res) {
    try {
        // Build the same query as getListings
        const query = buildSearchQuery(req.query);

        // Build sort object
        const sortObject = buildSortObject(req.query.sort);

        // Fetch with field selection (only what we need for map)
        // Selecting specific fields reduces data transfer and memory
        const listings = await Listing.find(query)
            .select("_id title price location image images")
            .sort(sortObject) // 🆕 Apply sorting
            .limit(200) // Max 200 markers for performance
            .lean();

        // Transform: extract first image for each listing
        const mapListings = listings.map((listing) => {
            const firstImage = listing.images?.[0] || listing.image || null;
            return {
                _id: listing._id,
                title: listing.title,
                price: listing.price,
                location: listing.location,
                image: firstImage,
            };
        });

        return res.status(200).json({
            success: true,
            listings: mapListings,
            count: mapListings.length,
            sortedBy: req.query.sort || "newest", // 🆕 Echo back the sort used
        });
    } catch (err) {
        console.error("getMapListings error:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching map listings",
        });
    }
}


/**
 * GET SINGLE LISTING
 * GET /api/listings/:id
 */
export async function getListingById(req, res) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid listing id" });
        }

        const listing = await Listing.findById(req.params.id)
            .populate("owner", "username email avatar")
            .lean();

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        return res.status(200).json({ property: listing });
    } catch (err) {
        console.error("getListingById error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

/**
 * CONTACT SELLER → SEND EMAIL
 * POST /api/listings/:id/interested
 */
export async function markInterested(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const listing = await Listing.findById(req.params.id)
            .populate("owner", "username email");

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        const user = await User.findById(req.user.id)
            .select("username email phone");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await sendEmail({
            to: listing.owner.email,
            subject: "Someone is interested in your property",
            replyTo: user.email,
            html: `
                <h3>New Property Interest</h3>
                <p><strong>Property:</strong> ${listing.title}</p>
                <p><strong>Name:</strong> ${user.username}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p>Reply to this email to contact the user.</p>
            `,
        });

        return res.status(200).json({
            message: "Interest email sent to property owner",
        });
    } catch (err) {
        console.error("markInterested error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
