import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ---------------- SIGNUP ----------------
export const signup = async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;

        // Basic validation
        if (!username || !email || !password || !phone) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check email uniqueness
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(409).json({
                message: "Email already exists",
            });
        }

        // Check username uniqueness
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(409).json({
                message: "Username already exists",
            });
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create user (✅ phone added)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone,
        });

        await newUser.save();

        return res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Signup error:", error);

        // MongoDB duplicate key safety net
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        return res.status(500).json({
            message: "Server error",
        });
    }
};

// ---------------- SIGNIN ----------------
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // Remove password before sending response
        const { password: pass, ...rest } = user._doc;

        const isProduction = process.env.NODE_ENV === "production";

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: isProduction,                 // true only in production (HTTPS)
            sameSite: isProduction ? "none" : "lax",
            path: "/",
        });

        return res.status(200).json(rest);
    } catch (error) {
        console.error("Signin error:", error);
        return res.status(500).json({
            message: "Server error",
        });
    }
};
