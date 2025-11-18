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
        city: String,
        state: String,
        postalCode: String,
    },
    images: [
        {
            url: String,
            public_id: String,
            uploader: mongoose.Schema.Types.ObjectId,
        },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Listing", listingSchema);
