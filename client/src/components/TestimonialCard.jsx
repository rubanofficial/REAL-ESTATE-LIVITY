import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

// This component receives a 'testimonial' object as a prop
export default function TestimonialCard({ testimonial }) {
    const { quote, name, location, rating } = testimonial;


    return (
        // 'h-full' ensures all cards in the slider have the same height
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col h-full">
            <FaQuoteLeft className="text-4xl text-blue-500 mb-4" />

            {/* 'flex-grow' makes this div take up all available space, pushing the name/rating to the bottom */}
            <p className="text-slate-600 italic mb-6 flex-grow">{quote}</p>

            <div>
                <p className="font-bold text-slate-800">{name}</p>
                <p className="text-sm text-slate-500">{location}</p>

                {/* Render stars based on the rating number */}
                <div className="flex mt-2">
                    {Array.from({ length: rating }).map((_, index) => (
                        <FaStar key={index} className="text-yellow-400" />
                    ))}
                </div>
            </div>
        </div>
    );
}