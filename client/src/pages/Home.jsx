import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ImageSlider from '../components/ImageSlider';
import Testimonials from '../components/Testimonials';
import PropertyCard from '../components/PropertyCard';

// (Your DUMMY_DATA and useEffect hook remain exactly the same)
// ... DUMMY_DATA and useEffect ...
const DUMMY_DATA = {
    // --- UPDATED: Added a third offer ---
    offers: [
        { _id: 'offer1', name: 'Luxury Villa with Special Offer', type: 'sale', offer: true, regularPrice: 2500000, discountPrice: 2200000, imageUrls: ['https://images.unsplash.com/photo-1570129477490-75c9a2f38aeb?q=80&w=2070&auto=format=fit=crop'], address: '123 Exclusive St, Beverly Hills', bedrooms: 4, bathrooms: 3 },
        { _id: 'offer2', name: 'Beachfront Condo with Price Drop', type: 'sale', offer: true, regularPrice: 800000, discountPrice: 750000, imageUrls: ['https://images.unsplash.com/photo-1558969449-7a3d0f39385b?q=80&w=1964&auto=format=fit=crop'], address: '789 Ocean View, Miami', bedrooms: 2, bathrooms: 2 },
        { _id: 'offer3', name: 'City Penthouse with $50k Off', type: 'sale', offer: true, regularPrice: 1500000, discountPrice: 1450000, imageUrls: ['https://images.unsplash.com/photo-1560185007-c5ca915a01f1?q=80&w=2070&auto=format=fit=crop'], address: '999 Skyview, Chicago', bedrooms: 3, bathrooms: 3 },
    ],
    rentals: [
        { _id: 'rent1', name: 'Downtown Apartment for Rent', type: 'rent', offer: false, regularPrice: 3000, imageUrls: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop'], address: '456 Main St, New York', bedrooms: 2, bathrooms: 1 },
        { _id: 'rent2', name: 'Charming Studio in Historic District', type: 'rent', offer: false, regularPrice: 1800, imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format=fit=crop'], address: '101 Old Town Rd, Boston', bedrooms: 1, bathrooms: 1 },
        { _id: 'rent3', name: 'Spacious Loft with City Views', type: 'rent', offer: false, regularPrice: 4500, imageUrls: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1980&auto=format&fit=crop'], address: '321 High Rise Ave, Chicago', bedrooms: 3, bathrooms: 2 },
    ],
    // --- UPDATED: Added a third sale item ---
    sales: [
        { _id: 'sale1', name: 'Suburban Family Home for Sale', type: 'sale', offer: false, regularPrice: 650000, imageUrls: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'], address: '789 Oak Ave, Austin', bedrooms: 3, bathrooms: 2 },
        { _id: 'sale2', name: 'Modern Farmhouse on 5 Acres', type: 'sale', offer: false, regularPrice: 1200000, imageUrls: ['https://images.unsplash.com/photo-1588880331179-62bde397ba11?q=80&w=2070&auto=format&fit=crop'], address: '555 Country Ln, Nashville', bedrooms: 4, bathrooms: 3 },
        { _id: 'sale3', name: 'Classic Brick Colonial', type: 'sale', offer: false, regularPrice: 850000, imageUrls: ['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop'], address: '456 Washington St, Georgetown', bedrooms: 4, bathrooms: 4 },
    ]
};

export default function Home() {
    const [offerListings, setOfferListings] = useState([]);
    const [rentListings, setRentListings] = useState([]);
    const [saleListings, setSaleListings] = useState([]);

    useEffect(() => {
        const fetchListings = () => {
            setOfferListings(DUMMY_DATA.offers);
            setRentListings(DUMMY_DATA.rentals);
            setSaleListings(DUMMY_DATA.sales);
        };
        fetchListings();
    }, []);

    return (
        <div>
            <ImageSlider />
            <div className="max-w-7xl mx-auto p-4 flex flex-col gap-12 my-10">

                {/* --- RECENT OFFERS SECTION --- */}
                {offerListings && offerListings.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <div className="my-3">
                            <h2 className="text-3xl font-semibold text-slate-700">Recent Offers</h2>
                            <Link className="text-sm text-blue-600 hover:underline" to={'/search?offer=true'}>
                                Show more offers
                            </Link>
                        </div>
                        {/* --- 1. THIS LINE IS UPDATED --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {offerListings.map((listing) => (
                                <PropertyCard listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- RECENT RENTALS SECTION --- */}
                {rentListings && rentListings.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                        <div className="my-3">
                            <h2 className="text-3xl font-semibold text-slate-700">Recent Places for Rent</h2>
                            <Link className="text-sm text-blue-600 hover:underline" to={'/search?type=rent'}>
                                Show more places for rent
                            </Link>
                        </div>
                        {/* --- 2. THIS LINE IS UPDATED --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rentListings.map((listing) => (
                                <PropertyCard listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- RECENT SALES SECTION --- */}
                {saleListings && saleListings.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                        <div className="my-3">
                            <h2 className="text-3xl font-semibold text-slate-700">Recent Places for Sale</h2>
                            <Link className="text-sm text-blue-600 hover:underline" to={'/search?type=sale'}>
                                Show more places for sale
                            </Link>
                        </div>
                        {/* --- 3. THIS LINE IS UPDATED --- */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {saleListings.map((listing) => (
                                <PropertyCard listing={listing} key={listing._id} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
            <Testimonials />
        </div>
    );
}

