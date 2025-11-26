// server/api/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export default async function authenticate(req, res, next) {
    try {
        // Read the correct cookie name: access_token
        const token =
            req.cookies?.access_token ||
            req.cookies?.token ||
            (req.headers.authorization && req.headers.authorization.split(" ")[1]);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.id).select("-password").lean();
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: user not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}
