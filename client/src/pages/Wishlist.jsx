import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";

export default function Wishlist() {
    const [favorites, setFavorites] = useState([]);

    const API_BASE = import.meta.env.DEV
        ? "http://localhost:10000"
        : import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        fetch(`${API_BASE}/api/users/favorites`, {
            credentials: "include",
        })
            .then(res => res.json())
            .then(data => setFavorites(data.favorites));
    }, []);

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl mb-6">My Wishlist ❤️</h1>

            {favorites.length === 0 && <p>No favorites yet.</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((listing) => (
                    <PropertyCard key={listing._id} listing={listing} />
                ))}
            </div>
        </div>
    );
}
