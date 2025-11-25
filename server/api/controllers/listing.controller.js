// server/api/controllers/listing.controller.js
import Listing from "../models/listing.model.js";
import { uploadBufferToCloudinary, cloudinary } from "../utils/cloudinary.js";

export async function createListing(req, res) {
    try {
        // 1. Auth
        if (!req.user) return res.status(401).json({ message: "Unauthorized" });

        // 2. File
        const file = req.file;
        if (!file) return res.status(400).json({ message: "Image (field 'image') is required" });

        // 3. Fields
        const {
            title = "",
            description = "",
            price,
            currency = "INR",
            type = "sale",
            furnished = false,
            bedrooms = 1,
            bathrooms = 1,
            areaSqFt = 0,
            address
        } = req.body;

        if (!title.trim()) return res.status(400).json({ message: "Title required" });
        if (!price || Number(price) <= 0) return res.status(400).json({ message: "Valid price required" });

        // 4. Parse address if frontend sends JSON string
        let addressObj = {};
        try {
            addressObj = typeof address === "string" ? JSON.parse(address) : (address || {});
        } catch (e) {
            return res.status(400).json({ message: "Address must be valid JSON" });
        }
        if (!addressObj.city || !String(addressObj.city).trim()) return res.status(400).json({ message: "City required" });

        // 5. Upload image buffer to Cloudinary
        const uploadResult = await uploadBufferToCloudinary(file.buffer, "rems_listings");

        // 6. Create listing document
        const listing = new Listing({
            title: title.trim(),
            description,
            price: Number(price),
            currency,
            type,
            furnished: furnished === "true" || furnished === true,
            bedrooms: Number(bedrooms) || 1,
            bathrooms: Number(bathrooms) || 1,
            areaSqFt: Number(areaSqFt) || 0,
            address: addressObj,
            image: { url: uploadResult.url, public_id: uploadResult.public_id },
            owner: req.user._id,
        });

        await listing.save();

        // 7. Return created listing
        return res.status(201).json({ property: listing });
    } catch (err) {
        console.error("Create listing error:", err);

        // if upload created an image but DB failed, attempt to delete it (best-effort)
        if (err?.uploadResult?.public_id) {
            try { await cloudinary.uploader.destroy(err.uploadResult.public_id); } catch (e) { }
        }
        return res.status(500).json({ message: "Server error", error: err.message });
    }
}
