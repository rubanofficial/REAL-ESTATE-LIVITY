import User from "../models/user.model.js";

export const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user._id;
        const { listingId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const index = user.favorites.indexOf(listingId);

        // If already favorited → remove
        if (index !== -1) {
            user.favorites.splice(index, 1);
        }
        // Else → add
        else {
            user.favorites.push(listingId);
        }

        await user.save();

        res.status(200).json({
            favorites: user.favorites,
            message: index !== -1 ? "Removed from wishlist" : "Added to wishlist",
        });
    } catch (err) {
        console.error("toggleFavorite error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("favorites")
            .lean();

        res.status(200).json({ favorites: user.favorites });
    } catch (err) {
        console.error("getFavorites error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
