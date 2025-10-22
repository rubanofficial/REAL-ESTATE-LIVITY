// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider';

export default function Home() {
    return (
        <div>
            {/* Top section with the image slider */}
            <ImageSlider />

            {/* Section below the slider for call-to-action and info */}
            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
                <h1 className="text-slate-700 font-bold text-3xl lg:text-5xl">
                    Find your next <span className="text-slate-500">perfect</span> place with ease
                </h1>
                <div className="text-gray-500 text-sm">
                    Ruban Estate is the best place to find your next perfect home. We have a wide range of properties for you to choose from.
                </div>
                <Link to={'/search'} className="text-sm text-blue-800 font-bold hover:underline">
                    Let's get started...
                </Link>
            </div>

            {/* We will add sections for "Recent Offers", "Places for Rent", etc. here later */}
        </div>
    );
}