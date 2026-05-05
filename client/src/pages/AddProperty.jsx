// AddProperty page with form, image upload, and map-based location picker.
import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

const DEFAULT_PICKER_CENTER = [20.5937, 78.9629];

/**
 * Create a custom house icon for the map marker.
 * @returns {L.DivIcon}
 */
function createHouseIcon() {
    const svg = `
        <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path fill="#2563EB" d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
            <path fill="#1E40AF" d="M9 20v-6h6v6" />
        </svg>
    `;

    return L.divIcon({
        className: "livity-house-icon",
        html: svg,
        iconSize: [30, 30],
        iconAnchor: [15, 28],
    });
}

/**
 * Map click handler for selecting a location.
 * @param {{ onPick: (lat: number, lng: number) => void }} props
 */
function LocationPicker({ onPick }) {
    useMapEvent("click", (event) => {
        onPick(event.latlng.lat, event.latlng.lng);
    });

    return null;
}

export default function AddProperty() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        currency: "INR",
        type: "sale",
        bedrooms: 1,
        bathrooms: 1,
        areaSqFt: "",
        address: { street: "", city: "", state: "", postalCode: "" },
        location: { lat: null, lng: null },
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);

    const fileInputRef = useRef(null);

    /**
     * Update form state from inputs.
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    /**
     * Handle image selection and preview.
     * @param {React.ChangeEvent<HTMLInputElement>} e
     */
    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Only image files allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be ≤ 5MB");
            return;
        }

        setImageFile(file);
        setError("");

        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);

        e.target.value = "";
    };

    const removeImage = () => {
        setImageFile(null);
        setPreview(null);
    };

    const validate = () => {
        if (!form.title.trim()) return "Title is required";
        if (!form.price || Number(form.price) <= 0) return "Enter valid price";
        if (!form.address.city.trim()) return "City is required";
        if (!imageFile) return "Please upload an image";
        return null;
    };

    /**
     * Submit the listing to the API.
     * @param {React.FormEvent<HTMLFormElement>} e
     */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const err = validate();
        if (err) return setError(err);

        setLoading(true);
        setError("");
        setProgressPercent(0);

        try {
            const fd = new FormData();
            fd.append("title", form.title);
            fd.append("description", form.description);
            fd.append("price", form.price);
            fd.append("currency", "INR");
            fd.append("type", form.type);
            fd.append("bedrooms", form.bedrooms);
            fd.append("bathrooms", form.bathrooms);
            fd.append("areaSqFt", form.areaSqFt);
            fd.append("address", JSON.stringify(form.address));
            if (typeof form.location.lat === "number" && typeof form.location.lng === "number") {
                fd.append("location", JSON.stringify(form.location));
            }
            fd.append("image", imageFile);

            const API_BASE =
                import.meta.env.DEV
                    ? "http://localhost:10000"
                    : import.meta.env.VITE_BACKEND_URL;

            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("POST", `${API_BASE}/api/listings/create`, true);

                // 🔥 Required for JWT cookie
                xhr.withCredentials = true;

                xhr.upload.onprogress = (ev) => {
                    if (ev.lengthComputable) {
                        setProgressPercent(Math.round((ev.loaded / ev.total) * 100));
                    }
                };

                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 201) {
                        const res = JSON.parse(xhr.responseText);
                        resolve(res);

                        if (res?.property?._id) {
                            navigate(`/listing/${res.property._id}`);
                        } else {
                            navigate("/");
                        }
                    } else {
                        const msg = JSON.parse(xhr.responseText)?.message || "Upload failed";
                        reject(new Error(msg));
                    }
                };

                xhr.onerror = () => reject(new Error("Network error"));
                xhr.send(fd);
            });
        } catch (err) {
            setError(err.message || "Submit failed");
        } finally {
            setLoading(false);
            setProgressPercent(0);
        }
    };

    return (
        <main className="max-w-3xl mx-auto p-4 sm:p-6">
            <h1 className="text-2xl font-semibold mb-5">Create Listing</h1>

            <form onSubmit={handleSubmit} className="space-y-5">

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title (e.g., 3BHK in Chennai)"
                    className="w-full p-2 border rounded"
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded min-h-[100px]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="Price (INR)"
                        className="p-2 border rounded"
                    />
                    <div className="p-2 border rounded bg-gray-50 flex items-center justify-center font-semibold">
                        INR
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium">Type</label>
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="p-2 border rounded w-full"
                        >
                            <option value="sale">Sale</option>
                            <option value="rent">Rent</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Bedrooms</label>
                        <input
                            type="number"
                            name="bedrooms"
                            value={form.bedrooms}
                            onChange={handleChange}
                            className="p-2 border rounded w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Bathrooms</label>
                        <input
                            type="number"
                            name="bathrooms"
                            value={form.bathrooms}
                            onChange={handleChange}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                </div>

                <input
                    name="areaSqFt"
                    value={form.areaSqFt}
                    onChange={handleChange}
                    placeholder="Area in sqft"
                    className="w-full p-2 border rounded"
                />

                <div className="space-y-2">
                    <h3 className="font-medium">Address</h3>
                    <input
                        name="address.street"
                        value={form.address.street}
                        onChange={handleChange}
                        placeholder="Street"
                        className="w-full p-2 border rounded"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                            name="address.city"
                            value={form.address.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="p-2 border rounded"
                        />
                        <input
                            name="address.state"
                            value={form.address.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="p-2 border rounded"
                        />
                        <input
                            name="address.postalCode"
                            value={form.address.postalCode}
                            onChange={handleChange}
                            placeholder="PIN"
                            className="p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="font-medium">Pick Location on Map</h3>
                    <div className="w-full h-64 sm:h-72 border rounded overflow-hidden">
                        <MapContainer
                            center={DEFAULT_PICKER_CENTER}
                            zoom={4}
                            className="w-full h-full"
                            scrollWheelZoom
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationPicker
                                onPick={(lat, lng) =>
                                    setForm((prev) => ({
                                        ...prev,
                                        location: { lat, lng },
                                    }))
                                }
                            />
                            {typeof form.location.lat === "number" &&
                                typeof form.location.lng === "number" && (
                                    <Marker
                                        position={[form.location.lat, form.location.lng]}
                                        draggable
                                        icon={createHouseIcon()}
                                        eventHandlers={{
                                            dragend: (event) => {
                                                const marker = event.target;
                                                const pos = marker.getLatLng();
                                                setForm((prev) => ({
                                                    ...prev,
                                                    location: {
                                                        lat: pos.lat,
                                                        lng: pos.lng,
                                                    },
                                                }));
                                            },
                                        }}
                                    />
                                )}
                        </MapContainer>
                    </div>
                    <p className="text-sm text-gray-600">
                        {typeof form.location.lat === "number" &&
                            typeof form.location.lng === "number"
                            ? `Selected: ${form.location.lat.toFixed(5)}, ${form.location.lng.toFixed(5)}`
                            : "Click the map to set a location."}
                    </p>
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Property Image (≤ 5MB)
                    </label>

                    <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer inline-block">
                        Choose Image
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </label>

                    {preview && (
                        <div className="mt-3">
                            <img
                                src={preview}
                                alt="preview"
                                className="rounded shadow w-full sm:w-48 h-40 object-cover"
                            />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="mt-2 sm:mt-0 inline-block bg-black text-white rounded w-8 h-8 text-xs"
                            >
                                ×
                            </button>
                        </div>
                    )}
                </div>

                {progressPercent > 0 && (
                    <div className="w-full bg-gray-200 h-2 rounded mt-2">
                        <div
                            style={{ width: `${progressPercent}%` }}
                            className="h-2 bg-blue-600 rounded"
                        />
                    </div>
                )}

                {error && <p className="text-red-600">{error}</p>}

                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded"
                    >
                        {loading ? "Uploading..." : "Create Listing"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto px-5 py-2 border rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}
