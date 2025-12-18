// server/api/controllers/listing.controller.js
import Listing from "../models/listing.model.js";
import { uploadBufferToCloudinary, cloudinary } from "../utils/cloudinary.js";

export async function createListing(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image (field 'image') is required" });
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
            address
        } = req.body;

        if (!String(title).trim()) {
            return res.status(400).json({ message: "Title required" });
        }
        if (!price || Number(price) <= 0) {
            return res.status(400).json({ message: "Valid price required" });
        }

        let addressObj = {};
        if (address) {
            try {
                addressObj = typeof address === "string" ? JSON.parse(address) : address;
            } catch {
                return res.status(400).json({ message: "Address must be valid JSON" });
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
            furnished: req.body.furnished === "true" || req.body.furnished === true,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            areaSqFt: Number(areaSqFt),
            address: addressObj,
            image: {
                url: uploadResult.url,
                public_id: uploadResult.public_id,
            },
            owner: req.user._id,
        });

        res.status(201).json({ property: listing });
    } catch (err) {
        console.error("createListing error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

/**
 * GET ALL LISTINGS
 * GET /api/listings
 */
export async function getListings(req, res) {
    try {
        const listings = await Listing.find().sort({ createdAt: -1 });
        res.json({ listings });
    } catch (err) {
        console.error("getListings error:", err);
        res.status(500).json({ message: "Server error" });
    }
}

/**
 * GET SINGLE LISTING
 * GET /api/listings/:id
 */
export async function getListingById(req, res) {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id)
            .populate("owner", "username email avatar")
            .lean();

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        res.json({ property: listing });
    } catch (err) {
        console.error("getListingById error:", err);
        res.status(500).json({ message: "Server error" });
    }
}
