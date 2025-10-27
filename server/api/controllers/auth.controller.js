// 1. Import the User model (the "recipe book" from your Canvas)
import User from '../models/user.model.js';
// 2. Import bcryptjs for password hashing
import bcryptjs from 'bcryptjs';

// 3. This is the 'signup' function
// We make it 'async' because database operations take time
export const signup = async (req, res) => {
    // 4. Get the data from the frontend form (req.body)
    const { username, email, password } = req.body;

    try {
        // 5. Hash the password
        // 'bcryptjs.hashSync' is a fast way to hash. 10 is the 'salt' - how strong the hash is.
        const hashedPassword = bcryptjs.hashSync(password, 10);

        // 6. Create a new user object using the User model
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Store the HASHED password
            // Note: The 'avatar' field will use the default value from your model
        });

        // 7. Save the new user to the database
        // 'await' pauses the function until this database operation is complete
        await newUser.save();

        // 8. Send a success response back to the frontend
        // '201' is the HTTP status code for "Created"
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        // 9. If anything goes wrong (e.g., duplicate email), send an error
        res.status(500).json({ message: error.message });
    }
};

