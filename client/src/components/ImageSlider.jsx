// src/components/ImageSlider/ImageSlider.jsx

import React from 'react';
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Dummy image data - later this will come from our database
const images = [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=2070&auto=format&fit=crop',
];

export default function ImageSlider() {
    return (
        <Swiper
            // Install Swiper modules
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={0} // No space between slides
            slidesPerView={1} // Show one slide at a time
            navigation // Enable navigation arrows
            pagination={{ clickable: true }} // Enable clickable pagination dots
            autoplay={{ delay: 3000, disableOnInteraction: false }} // Auto-play every 3 seconds
            loop={true} // Loop back to the beginning
            effect="fade" // Use a fade effect for transitions
            className="w-full h-[550px]" // Set the size of the slider
        >
            {images.map((url, index) => (
                <SwiperSlide key={index}>
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${url})` }}
                    ></div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}