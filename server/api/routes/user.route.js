import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
    toggleFavorite,
    getFavorites,
} from "../controllers/user.controller.js";

const router = express.Router();

// ❤️ ADD / REMOVE FAVORITE
router.post("/favorites/:listingId", authenticate, toggleFavorite);

// 📄 GET USER FAVORITES
router.get("/favorites", authenticate, getFavorites);

export default router;
