import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { FaBed, FaBath } from 'react-icons/fa';

export default function PropertyCard({ listing }) {

    // 🔹 1. Handle image from DB or dummy data
    const imageSrc =
        listing.image?.url ||
        (listing.imageUrls && listing.imageUrls[0]) ||
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750';

    // 🔹 2. Handle title/name
    const title = listing.title || listing.name;

    // 🔹 3. Handle address (object or string)
    const address =
        typeof listing.address === 'string'
            ? listing.address
            : listing.address?.city || '';

    // 🔹 4. Handle price (DB or dummy)
    const price = listing.offer
        ? listing.discountPrice
        : listing.price || listing.regularPrice;

    return (
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] group">

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
