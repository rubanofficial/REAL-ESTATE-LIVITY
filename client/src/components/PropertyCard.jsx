// 1. Import Link for navigation and icons for details
import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

// 2. This component receives a 'listing' object as a prop from its parent (e.g., HomePage)
export default function PropertyCard({ listing }) {
    return (
        // 3. Main container for the card
        // 'group' is a Tailwind utility that lets us style child elements on hover
        // 'shadow-md hover:shadow-lg' adds a subtle shadow that gets bigger on hover
        // 'transition-shadow' makes the shadow change smoothly
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] group">

            {/* 4. The entire card is a clickable link to that property's page */}
            <Link to={`/listing/${listing._id}`}>

                {/* --- IMAGE SECTION --- */}
                <img
                    src={
                        // 5. Use the first image from the listing, or a fallback image if none exist
                        listing.imageUrls[0] ||
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
                    }
                    alt={listing.name}
                    // 6. Styling for the image
                    // 'object-cover' ensures the image covers the area without distortion
                    // 'group-hover:scale-105' makes the image zoom slightly when the card is hovered
                    // 'transition-scale' animates the zoom effect smoothly
                    className="h-[320px] sm:h-[220px] w-full object-cover group-hover:scale-105 transition-scale duration-300"
                />

                {/* --- DETAILS SECTION --- */}
                <div className="p-4 flex flex-col gap-2 w-full">
                    {/* Property Name */}
                    {/* 'truncate' adds '...' if the text is too long for one line */}
                    <p className="text-lg font-semibold text-slate-700 truncate">
                        {listing.name}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="h-4 w-4 text-green-700" />
                        <p className="text-sm text-gray-600 truncate w-full">
                            {listing.address}
                        </p>
                    </div>

                    {/* Price */}
                    <p className="text-slate-500 mt-2 font-semibold">
                        $
                        {/* 7. Conditional Rendering for Price: Show discount price if there's an offer */}
                        {listing.offer
                            ? listing.discountPrice.toLocaleString('en-US')
                            : listing.regularPrice.toLocaleString('en-US')}
                        {listing.type === 'rent' && ' / month'}
                    </p>

                    {/* Beds and Baths */}
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xs flex items-center gap-1">
                            <FaBed className="text-lg" />
                            {/* 8. Conditional Rendering for Pluralization */}
                            {listing.bedrooms > 1
                                ? `${listing.bedrooms} beds `
                                : `${listing.bedrooms} bed `}
                        </div>
                        <div className="font-bold text-xs flex items-center gap-1">
                            <FaBath className="text-lg" />
                            {listing.bathrooms > 1
                                ? `${listing.bathrooms} baths `
                                : `${listing.bathrooms} bath `}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}