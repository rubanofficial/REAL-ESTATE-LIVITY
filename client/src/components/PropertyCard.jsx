import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath, FaHeart } from 'react-icons/fa';

export default function PropertyCard({ listing }) {

    // ❤️ wishlist state (local)
    const [isFavorited, setIsFavorited] = useState(false);
    const [loading, setLoading] = useState(false);

    const API_BASE = import.meta.env.DEV
        ? "http://localhost:10000"
        : import.meta.env.VITE_BACKEND_URL;

    // 🔹 Handle image
    const imageSrc =
        listing.image?.url ||
        (listing.imageUrls && listing.imageUrls[0]) ||
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750';

    // 🔹 Handle title
    const title = listing.title || listing.name;

    // 🔹 Handle address
    const address =
        typeof listing.address === 'string'
            ? listing.address
            : listing.address?.city || '';

    // 🔹 Handle price
    const price = listing.offer
        ? listing.discountPrice
        : listing.price || listing.regularPrice;

    // ❤️ Wishlist click handler
    const handleFavorite = async (e) => {
        e.preventDefault(); // stop Link navigation
        e.stopPropagation();

        try {
            setLoading(true);

            const res = await fetch(
                `${API_BASE}/api/users/favorites/${listing._id}`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!res.ok) {
                throw new Error("Failed to update wishlist");
            }

            // toggle heart UI
            setIsFavorited(!isFavorited);
        } catch (err) {
            console.error("Wishlist error:", err);
            alert("Please login to add wishlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] group relative">

            {/* ❤️ WISHLIST BUTTON */}
            <button
                onClick={handleFavorite}
                disabled={loading}
                className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow"
            >
                <FaHeart
                    className={`text-lg ${isFavorited ? "text-red-500" : "text-gray-400"
                        }`}
                />
            </button>

            <Link to={`/listing/${listing._id}`}>

                {/* IMAGE */}
                <img
                    src={imageSrc}
                    alt={title}
                    className="h-[320px] sm:h-[220px] w-full object-cover group-hover:scale-105 transition-scale duration-300"
                />

                {/* DETAILS */}
                <div className="p-4 flex flex-col gap-2 w-full">

                    {/* TITLE */}
                    <p className="text-lg font-semibold text-slate-700 truncate">
                        {title}
                    </p>

                    {/* LOCATION */}
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="text-sm text-gray-600 truncate w-full">
                            {address}
                        </p>
                    </div>

                    {/* PRICE */}
                    <p className="text-slate-500 mt-2 font-semibold">
                        ₹ {price}
                        {listing.type === 'rent' && ' / month'}
                    </p>

                    {/* BEDS & BATHS */}
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xs flex items-center gap-1">
                            <FaBed className="text-lg" />
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} beds`
                                : `${listing.bedrooms || 1} bed`}
                        </div>

                        <div className="font-bold text-xs flex items-center gap-1">
                            <FaBath className="text-lg" />
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} baths`
                                : `${listing.bathrooms || 1} bath`}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
