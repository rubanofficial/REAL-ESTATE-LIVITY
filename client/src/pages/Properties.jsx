import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard";

export default function Properties() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/listings");
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.message || "Failed to fetch properties");
                }

                setListings(data.listings);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading properties...</p>;
    }

    if (error) {
        return (
            <p className="text-center mt-10 text-red-600">
                Error: {error}
            </p>
        );
    }

    if (listings.length === 0) {
        return <p className="text-center mt-10">No properties found.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Properties</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <PropertyCard key={listing._id} listing={listing} />
                ))}
            </div>
        </div>
    );
}
