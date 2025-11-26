import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// --- SIGNUP ---
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: "User created!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- SIGNIN ---
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return res.status(404).json({ message: "User not found" });

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return res.status(401).json({ message: "Invalid password" });

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = validUser._doc;

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
        }).status(200).json(rest);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
