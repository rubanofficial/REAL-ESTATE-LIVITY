// server/api/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // adjust if your user model path or name differs

export default async function authenticate(req, res, next) {
    try {
        // read httpOnly cookie named 'token'
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        if (!token) return res.status(401).json({ message: "Unauthorized" });

        const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret");
        // optional: fetch user from DB (if you have users)
        if (User) {
            const user = await User.findById(payload.id).select("-password").lean();
            if (!user) return res.status(401).json({ message: "User not found" });
            req.user = user;
        } else {
            req.user = { _id: payload.id, email: payload.email };
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
