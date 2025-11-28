// server/api/controllers/listing.controller.js
import Listing from "../models/listing.model.js";
import { uploadBufferToCloudinary, cloudinary } from "../utils/cloudinary.js";

export async function createListing(req, res) {
    try {
        console.log("=== createListing called ===");
        console.log("ENV cloud name:", process.env.CLOUD_NAME ? "SET" : "NOT SET");

        // AUTH
        if (!req.user) {
            console.warn("createListing: no req.user");
            return res.status(401).json({ message: "Unauthorized" });
        }
        console.log("createListing: user id:", req.user._id?.toString?.());

        // FILE CHECK
        if (!req.file) {
            console.warn("createListing: missing req.file");
            return res.status(400).json({ message: "Image (field 'image') is required" });
        }
        console.log("createListing: file size:", req.file.size, "buffer?", !!req.file.buffer);

        // BODY FIELDS
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

        if (!String(title || "").trim()) return res.status(400).json({ message: "Title required" });
        if (!price || Number(price) <= 0) return res.status(400).json({ message: "Valid price required" });

        // parse address safely
        let addressObj = {};
        if (address) {
            try {
                addressObj = typeof address === "string" ? JSON.parse(address) : address;
            } catch (e) {
                console.error("Address JSON parse failed:", e);
                return res.status(400).json({ message: "Address must be valid JSON" });
            }
        }
        if (!addressObj?.city) return res.status(400).json({ message: "City is required" });

        // CLOUDINARY UPLOAD (defensive)
        let uploadResult;
        try {
            uploadResult = await uploadBufferToCloudinary(req.file.buffer, "rems_listings");
            console.log("Cloudinary upload result:", uploadResult);
        } catch (uploadErr) {
            console.error("Cloudinary upload failed:", uploadErr && uploadErr.message ? uploadErr.message : uploadErr);
            return res.status(502).json({ message: "Image upload failed", error: String(uploadErr.message || uploadErr) });
        }

        // CREATE DB DOCUMENT
        const listing = new Listing({
            title: String(title).trim(),
            description: description || "",
            price: Number(price),
            currency,
            type,
            furnished: (req.body.furnished === "true" || req.body.furnished === true) || false,
            bedrooms: Number(bedrooms) || 1,
            bathrooms: Number(bathrooms) || 1,
            areaSqFt: Number(areaSqFt) || 0,
            address: addressObj,
            image: { url: uploadResult.url, public_id: uploadResult.public_id },
            owner: req.user._id,
        });

        await listing.save();

        console.log("Listing created id:", listing._id);
        return res.status(201).json({ property: listing });
    } catch (err) {
        console.error("createListing UNHANDLED ERROR:", err && err.stack ? err.stack : err);
        // best-effort cleanup if upload happened
        try {
            if (err?.uploadResult?.public_id) {
                await cloudinary.uploader.destroy(err.uploadResult.public_id);
            }
        } catch (e) {
            console.warn("Cleanup failed:", e);
        }
        return res.status(500).json({ message: "Server error", error: String(err.message || err) });
    }
}
