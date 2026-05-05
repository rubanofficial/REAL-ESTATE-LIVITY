// Renders a Leaflet map with property markers and popups.
import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";

const DEFAULT_CENTER = [20.5937, 78.9629];
const DEFAULT_ZOOM = 4;

/**
 * Create a custom house marker icon using inline SVG.
 * @returns {L.DivIcon}
 */
function createHouseIcon() {
    const svg = `
    <svg width="36" height="36" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#2563EB" d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3l9-8z" />
      <path fill="#1E40AF" d="M9 20v-6h6v6" />
    </svg>
  `;

    return L.divIcon({
        className: "livity-house-icon",
        html: svg,
        iconSize: [36, 36],
        iconAnchor: [18, 34],
        popupAnchor: [0, -30],
    });
}

/**
 * Fits the map view to all marker positions.
 * @param {{ positions: Array<[number, number]> }} props
 */
function FitBounds({ positions }) {
    const map = useMap();

    useEffect(() => {
        if (!positions.length) {
            map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
            return;
        }

        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [30, 30] });
    }, [map, positions]);

    return null;
}

export default function MapView({ listings = [], loading = false, error = "" }) {
    const validListings = listings.filter(
        (listing) =>
            typeof listing?.location?.lat === "number" &&
            typeof listing?.location?.lng === "number"
    );

    const positions = validListings.map((listing) => [
        listing.location.lat,
        listing.location.lng,
    ]);

    const houseIcon = useMemo(() => createHouseIcon(), []);

    if (loading) {
        return (
            <div className="w-full h-[600px] flex items-center justify-center border rounded bg-white">
                <p className="text-gray-600">Loading map...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-[600px] flex items-center justify-center border rounded bg-white">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    if (!validListings.length) {
        return (
            <div className="w-full h-[600px] flex items-center justify-center border rounded bg-white">
                <p className="text-gray-600">No listings with map locations yet.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-[600px]">
            <MapContainer
                center={DEFAULT_CENTER}
                zoom={DEFAULT_ZOOM}
                className="w-full h-full rounded"
                scrollWheelZoom
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <FitBounds positions={positions} />

                {validListings.map((listing) => {
                    const imageUrl = listing.image?.url || listing.image?.[0]?.url || "";

                    return (
                        <Marker
                            key={listing._id}
                            position={[listing.location.lat, listing.location.lng]}
                            icon={houseIcon}
                        >
                            <Popup>
                                <div className="w-56">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={listing.title}
                                            className="h-24 w-full object-cover rounded"
                                        />
                                    ) : (
                                        <div className="h-24 w-full bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                                            No image
                                        </div>
                                    )}

                                    <div className="mt-2">
                                        <p className="text-sm font-semibold text-gray-900">
                                            {listing.title}
                                        </p>
                                        <p className="text-sm text-gray-600">₹ {listing.price}</p>
                                        <Link
                                            to={`/property/${listing._id}`}
                                            className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                                        >
                                            View Property
                                        </Link>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
