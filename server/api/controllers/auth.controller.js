import User from '../models/user.model.js';
import bcrypt from 'bcrypt';   // ✅ changed from bcryptjs → bcrypt
import jwt from 'jsonwebtoken';

// --- SIGNUP FUNCTION ---
export const signup = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // hash password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);  // ✅ bcrypt needs await
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- SIGNIN FUNCTION ---
export const signin = async (req, res) => {
    const { email, password } = req.body;
    try {
        // a. Check if user exists
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({ message: 'User not found' });

        // b. Check if password is correct
        const validPassword = await bcrypt.compare(password, validUser.password); // ✅ bcrypt compare also async
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        // c. If correct, create JWT token
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        // d. Remove password before sending
        const { password: pass, ...rest } = validUser._doc;

        // e. Send JWT in cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        })
            .status(200)
            .json(rest);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
