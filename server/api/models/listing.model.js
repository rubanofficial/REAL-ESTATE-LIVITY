// Defines the Listing schema for real estate properties.
// ===== ENHANCED WITH INDEXES FOR PRODUCTION-LEVEL SEARCH =====
import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: Number,
    currency: { type: String, default: "INR" },
    type: { type: String, enum: ["sale", "rent"], required: true },
    furnished: Boolean,
    bedrooms: Number,
    bathrooms: Number,
    areaSqFt: Number,

    address: {
        street: String,
        city: { type: String, required: true },
        state: String,
        postalCode: String,
    },

    // Geo location used for map views
    location: {
        lat: Number,
        lng: Number,
    },

    // SINGLE image (matches your AddProperty form)
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
    },

    // Optional gallery support
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

// ====================================
// 🚀 INDEXES FOR OPTIMIZED SEARCHING
// ====================================

// INDEX 1: City + Type (COMPOUND INDEX)
// WHY: Most searches filter by city AND type together
// Used in: city + type filters simultaneously
listingSchema.index({ "address.city": 1, type: 1 });

// INDEX 2: Price range queries
// WHY: Users filter by minPrice and maxPrice frequently
// Used in: price between X and Y
listingSchema.index({ price: 1 });

// INDEX 3: Sorting by creation date (newest first)
// WHY: When sorting by latest listings
// Used in: sort=newest queries
listingSchema.index({ createdAt: -1 });

// INDEX 4: Full-text search on title and description
// WHY: Fast text search across title + description without regex
// Used in: search=keyword queries
// Note: MongoDB will tokenize and search efficiently
listingSchema.index({ title: "text", description: "text" });

// INDEX 5: City alone (secondary)
// WHY: Fallback when only city filter is used (no type)
// Used in: city-only filter
listingSchema.index({ "address.city": 1 });

// INDEX 6: Type alone (secondary)
// WHY: Fallback when only type filter is used (no city)
// Used in: type-only filter
listingSchema.index({ type: 1 });

// INDEX 7: Owner (for retrieving seller's listings)
// WHY: When a seller wants to see their own listings
// Used in: user profile / dashboard
listingSchema.index({ owner: 1 });

// NOTES ON INDEXES:
// - Indexes speed up reads but slow writes slightly (MongoDB updates indexes)
// - Use compound indexes for queries that filter on multiple fields together
// - Text index allows fast keyword search without regex scanning
// - In production, monitor index usage with MongoDB's explain() method

export default mongoose.model("Listing", listingSchema);
