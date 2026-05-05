// client/src/pages/PropertyPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Skeleton = ({ lines = 6 }) => (
    <div className="animate-pulse space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded h-4 w-full" />
        ))}
    </div>
);

export default function PropertyPage() {
    const { id } = useParams();

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sending, setSending] = useState(false);

    const API_BASE = import.meta.env.DEV
        ? "http://localhost:10000"
        : import.meta.env.VITE_BACKEND_URL;

    // ================= FETCH PROPERTY =================
    useEffect(() => {
        let cancelled = false;

        const fetchProperty = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await fetch(`${API_BASE}/api/listings/${id}`);
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data?.message || "Failed to fetch property");
                }

                if (!cancelled) {
                    setProperty(data.property);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message || "Error fetching property");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        if (id) fetchProperty();

        return () => {
            cancelled = true;
        };
    }, [id, API_BASE]);

    // ================= CONTACT SELLER =================
    const handleContactSeller = async () => {
        if (!property?._id) return;

        try {
            setSending(true);

            const res = await fetch(
                `${API_BASE}/api/listings/${property._id}/interested`,
                {
                    method: "POST",
                    credentials: "include", // 🔐 VERY IMPORTANT
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "You must be logged in");
                return;
            }

            alert("✅ Email sent to the property owner!");
        } catch (err) {
            console.error("Contact seller error:", err);
            alert("Something went wrong. Try again.");
        } finally {
            setSending(false);
        }
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <main className="max-w-6xl mx-auto p-6">
                <div className="h-64 bg-gray-100 rounded mb-6" />
                <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4" />
                        <Skeleton lines={8} />
                    </div>
                    <aside className="p-4 bg-white rounded shadow">
                        <Skeleton lines={6} />
                    </aside>
                </div>
            </main>
        );
    }

    // ================= ERROR =================
    if (error) {
        return (
            <main className="max-w-4xl mx-auto p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Link to="/" className="text-blue-600 underline">
                    Back to home
                </Link>
            </main>
        );
    }

    if (!property) {
        return (
            <main className="max-w-4xl mx-auto p-6 text-center">
                <p>No property found.</p>
                <Link to="/" className="text-blue-600 underline">
                    Back to home
                </Link>
            </main>
        );
    }

    const {
        title,
        description,
        price,
        currency = "INR",
        type,
        furnished,
        bedrooms,
        bathrooms,
        areaSqFt,
        address = {},
        image,
        owner,
    } = property;

    const mainImage = image?.url || "/placeholder-house.png";

    // ================= UI =================
    return (
        <main className="max-w-6xl mx-auto p-6">
            <div className="rounded overflow-hidden mb-6">
                <img
                    src={mainImage}
                    alt={title}
                    className="w-full h-72 object-cover"
                />
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* LEFT */}
                <section className="col-span-2">
                    <h1 className="text-2xl font-semibold mb-2">{title}</h1>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="text-2xl font-bold">
                            {currency} {Number(price).toLocaleString()}
                        </div>
                        <div className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {type?.toUpperCase()}
                        </div>
                        {furnished && (
                            <div className="px-2 py-1 bg-green-100 rounded text-sm">
                                Furnished
                            </div>
                        )}
                    </div>

                    <div className="flex gap-6 text-sm text-gray-700 mb-4">
                        <div>🛏 {bedrooms} beds</div>
                        <div>🛁 {bathrooms} baths</div>
                        {areaSqFt && <div>📐 {areaSqFt} sqft</div>}
                    </div>

                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-800 whitespace-pre-line">
                        {description}
                    </p>

                    <div className="mt-6">
                        <h4 className="font-medium mb-2">Gallery</h4>
                        {image?.url ? (
                            <img
                                src={image.url}
                                alt="property"
                                className="h-28 w-40 object-cover rounded"
                            />
                        ) : (
                            <p className="text-sm text-gray-500">No images</p>
                        )}
                    </div>
                </section>

                {/* RIGHT */}
                <aside className="p-4 bg-white rounded shadow">
                    <div className="mb-4">
                        <h4 className="font-medium">Address</h4>
                        <p className="text-sm text-gray-700">
                            {address.street && (
                                <>
                                    {address.street}
                                    <br />
                                </>
                            )}
                            {address.city}, {address.state}{" "}
                            {address.postalCode}
                        </p>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-medium">Seller</h4>
                        <div className="flex items-center gap-3">
                            <img
                                src={
                                    owner?.avatar ||
                                    "/avatar-placeholder.png"
                                }
                                alt="seller"
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <div>
                                <div className="text-sm font-medium">
                                    {owner?.username}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {owner?.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={handleContactSeller}
                            disabled={sending}
                            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-70"
                        >
                            {sending ? "Sending..." : "Contact Seller"}
                        </button>

                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    window.location.href
                                )
                            }
                            className="px-3 py-2 border rounded text-sm"
                        >
                            Copy link
                        </button>

                        <Link
                            to="/"
                            className="text-sm text-gray-600 underline text-center"
                        >
                            Back to home
                        </Link>
                    </div>
                </aside>
            </div>
        </main>
    );
}
