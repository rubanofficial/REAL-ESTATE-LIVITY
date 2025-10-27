// 1. Import mongoose, which we need to create a Schema
import mongoose from 'mongoose';

// 2. Define the schema (the "blueprint" or "recipe" for a user)
const userSchema = new mongoose.Schema(
    {
        // The 'username' field
        username: {
            type: String, // Must be a string
            required: true, // It is required
            unique: true, // It must be unique (no two users can have the same username)
        },
        // The 'email' field
        email: {
            type: String,
            required: true,
            unique: true,
        },
        // The 'password' field
        password: {
            type: String,
            required: true,
        },
        // The 'avatar' field for the user's profile picture
        avatar: {
            type: String,
            // 3. A default value, so every user has a profile pic
            default:
                'https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg',
        },
    },
    // 4. Add timestamps
    // This automatically adds 'createdAt' and 'updatedAt' fields
    { timestamps: true }
);

// 5. Create the User model from the schema
// Mongoose will create a collection named 'users' (lowercase, plural)
const User = mongoose.model('User', userSchema);

// 6. Export the model so our controller can use it
export default User;

