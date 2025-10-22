// src/pages/Home.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// Framer Motion variants for a staggered animation effect
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3, // Each child will animate 0.3s after the previous one
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
        },
    },
};

export default function Home() {
    return (
        // Main container for the hero section
        <motion.div
            className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1
                className="text-slate-700 font-bold text-3xl lg:text-6xl"
                variants={itemVariants}
            >
                Find your next <span className="text-slate-500">perfect</span>
                <br />
                place with ease
            </motion.h1>

            <motion.div
                className="text-gray-400 text-xs sm:text-sm"
                variants={itemVariants}
            >
                Ruban Estate is the best place to find your next perfect home.
                <br />
                We have a wide range of properties for you to choose from.
            </motion.div>

            <motion.div variants={itemVariants}>
                <Link
                    to={'/search'} // We'll create this search page later
                    className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
                >
                    Let's get started...
                </Link>
            </motion.div>
        </motion.div>
    );
}