import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 🔍 search text
    const [search, setSearch] = useState("");

    // 🎛 filter toggle
    const [showFilters, setShowFilters] = useState(false);

    // 🎛 filter values
    const [filters, setFilters] = useState({
        city: "",
        type: "",
        minPrice: "",
        maxPrice: "",
    });

    const API_BASE = import.meta.env.DEV
        ? "http://localhost:10000"
        : import.meta.env.VITE_BACKEND_URL;

    // 🔄 fetch listings (search + filters)
    const fetchListings = async (searchText = "", filterData = {}) => {
        try {
            setLoading(true);
            setError("");

            // build query params safely
            const params = new URLSearchParams();

            if (searchText) params.append("search", searchText);
            if (filterData.city) params.append("city", filterData.city);
            if (filterData.type) params.append("type", filterData.type);
            if (filterData.minPrice) params.append("minPrice", filterData.minPrice);
            if (filterData.maxPrice) params.append("maxPrice", filterData.maxPrice);

            const res = await fetch(
                `${API_BASE}/api/listings?${params.toString()}`
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || "Failed to fetch");

            setListings(data.listings || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ⏱ initial load
    useEffect(() => {
        fetchListings();
    }, []);

    // 🔍 search button
    const handleSearch = () => {
        fetchListings(search, filters);
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Properties</h1>

            {/* 🔍 SEARCH BAR */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by city or title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    onClick={handleSearch}
                    className="px-5 py-2 bg-blue-600 text-white rounded"
                >
                    Search
                </button>
            </div>

            {/* 🎛 FILTER TOGGLE */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="mb-6 px-4 py-2 border rounded"
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {/* 🎛 FILTER PANEL */}
            {showFilters && (
                <div className="mb-6 p-4 border rounded grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input
                        placeholder="City"
                        value={filters.city}
                        onChange={(e) =>
                            setFilters({ ...filters, city: e.target.value })
                        }
                        className="border px-3 py-2 rounded"
                    />

                    <select
                        value={filters.type}
                        onChange={(e) =>
                            setFilters({ ...filters, type: e.target.value })
                        }
                        className="border px-3 py-2 rounded"
                    >
                        <option value="">All Types</option>
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                        }
                        className="border px-3 py-2 rounded"
                    />

                    <input
                        type="number"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                        }
                        className="border px-3 py-2 rounded"
                    />

                    <button
                        onClick={() => fetchListings(search, filters)}
                        className="col-span-full bg-blue-600 text-white py-2 rounded"
                    >
                        Apply Filters
                    </button>
                </div>
            )}

            {/* ⚠ STATES */}
            {loading && <p className="text-center">Loading properties...</p>}
            {error && <p className="text-center text-red-600">{error}</p>}
            {!loading && listings.length === 0 && (
                <p className="text-center">No properties found.</p>
            )}

            {/* 🏠 PROPERTY CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <PropertyCard key={listing._id} listing={listing} />
                ))}
            </div>
        </div>
    );
}
