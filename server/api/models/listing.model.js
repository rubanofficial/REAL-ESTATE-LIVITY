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

    // SINGLE image (matches your AddProperty form)
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
    },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

export default mongoose.model("Listing", listingSchema);
