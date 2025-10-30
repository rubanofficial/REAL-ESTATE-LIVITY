import User from '../models/user.model.js';
import bcryptjs from 'bcrypt';
import jwt from 'jsonwebtoken'; // <-- Tool for the "Access Card"

// This is your existing 'signup' function
export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedPassword = bcryptjs.hashSync(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// --- THIS IS THE NEW SIGNIN FUNCTION ---
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // a. Check if user exists
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({ message: 'User not found' });

        // b. Check if password is correct
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        // c. If correct, create the "Access Card" (JWT)
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        // d. Hide the password before sending user data
        const { password: pass, ...rest } = validUser._doc;

        // e. Send the JWT in a secure cookie and the user data as JSON
        res
            .cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) }) // Expires in 24h
            .status(200)
            .json(rest);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};