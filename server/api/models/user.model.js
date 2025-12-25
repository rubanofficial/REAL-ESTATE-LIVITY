// 1. Import mongoose
import mongoose from "mongoose";

// 2. Define the schema
const userSchema = new mongoose.Schema(
    {
        // Username
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        // Email
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        // Password (hashed)
        password: {
            type: String,
            required: true,
        },

        // 📞 Phone number (NEW)
        phone: {
            type: String,
            required: true,
        },

        // Profile picture
        avatar: {
            type: String,
            default:
                "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
        },

        // ❤️ Wishlist / Favorites
        favorites: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Listing",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// 3. Create the model
const User = mongoose.model("User", userSchema);

// 4. Export the model
export default User;
