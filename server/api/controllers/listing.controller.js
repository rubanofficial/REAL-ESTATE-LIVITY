// server/api/controllers/listing.controller.js
import Listing from "../models/listing.model.js";
import { uploadBufferToCloudinary, cloudinary } from "../utils/cloudinary.js";

export async function createListing(req, res) {
    try {
        // AUTH CHECK
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        const {
            title,
            description,
            price,
            currency = "INR",
            type = "sale",
            bedrooms = 1,
            bathrooms = 1,
            areaSqFt = 0,
            address
        } = req.body;

        if (!title?.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }
        if (!price || Number(price) <= 0) {
            return res.status(400).json({ message: "Valid price required" });
        }

        // Parse address JSON
        let addressObj = {};
        try {
            addressObj = typeof address === "string" ? JSON.parse(address) : address;
        } catch {
            return res.status(400).json({ message: "Address must be valid JSON" });
        }

        if (!addressObj?.city) {
            return res.status(400).json({ message: "City is required" });
        }

        // CLOUDINARY UPLOAD
        const uploadResult = await uploadBufferToCloudinary(req.file.buffer, "rems_listings");

        const listing = new Listing({
            title,
            description,
            price: Number(price),
            currency,
            type,
            bedrooms: Number(bedrooms),
            bathrooms: Number(bathrooms),
            areaSqFt: Number(areaSqFt),
            address: addressObj,
            image: {
                url: uploadResult.url,
                public_id: uploadResult.public_id
            },
            owner: req.user._id,
        });

        await listing.save();

        return res.status(201).json({ property: listing });

    } catch (err) {
        console.error("Create listing error:", err);
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}
