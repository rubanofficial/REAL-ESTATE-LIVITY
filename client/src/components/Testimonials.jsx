import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// --- FIXED IMPORT PATH ---
// The path was correct, so the error is likely a typo in a file or folder name.
// Double-check that you have a folder named "TestimonialCard" containing a file named "TestimonialCard.jsx".
import TestimonialCard from '../components/TestimonialCard';

const testimonialsData = [
    // ... rest of the component is the same
    {
        id: 1,
        quote: "Using Livity was a game-changer! We found our dream home in less than a week. The process was smooth and professional.",
        name: "Priya Sharma",
        location: "Chennai, Tamil Nadu",
        rating: 5,
    },
    {
        id: 2,
        quote: "As a first-time seller, I was nervous. The platform made it so easy to list my property and connect with serious buyers. Highly recommended!",
        name: "Arjun Kumar",
        location: "Coimbatore, Tamil Nadu",
        rating: 5,
    },
    {
        id: 3,
        quote: "The variety of rental properties is amazing. We found a beautiful apartment in our budget that we never would have found otherwise.",
        name: "Anjali Menon",
        location: "Madurai, Tamil Nadu",
        rating: 4,
    },
];

export default function Testimonials() {
    // ... rest of the component is the same
    return (
        <div className="bg-slate-100 py-16">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">
                    What Our Clients Say
                </h2>
                <p className="text-center text-slate-500 mb-8">
                    Discover the experiences of homeowners and renters who trust us.
                </p>

                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    breakpoints={{
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    }}
                    className="pb-12"
                >
                    {testimonialsData.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <TestimonialCard testimonial={testimonial} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}