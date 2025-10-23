import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import the logo
import livityLogo from '../assets/LOGO.png';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 h-16">

                {/* 2. Replace the H1 text logo with the IMG logo */}
                <Link to="/">
                    <img src={livityLogo} alt="Livity Logo" className="h-10 object-contain" />
                </Link>

                {/* --- DESKTOP NAVIGATION --- */}
                <nav className="hidden sm:flex items-center">
                    <ul className="flex gap-6 items-center">
                        <Link to="/">
                            <li className="text-slate-700 hover:text-blue-600 transition-colors duration-300">Home</li>
                        </Link>
                        {/* --- 1. ADDED PROPERTIES LINK FOR DESKTOP --- */}
                        <Link to="/search">
                            <li className="text-slate-700 hover:text-blue-600 transition-colors duration-300">Properties</li>
                        </Link>
                        <Link to="/about">
                            <li className="text-slate-700 hover:text-blue-600 transition-colors duration-300">About</li>
                        </Link>
                        <Link to="/sign-up">
                            <li className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300">
                                SignUp
                            </li>
                        </Link>
                    </ul>
                </nav>

                {/* --- MOBILE MENU ICON --- */}
                <div className="sm:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-700 text-2xl">
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* --- MOBILE MENU DROPDOWN --- */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="sm:hidden bg-white shadow-lg absolute top-16 left-0 w-full"
                    >
                        <ul className="flex flex-col items-center gap-4 p-4">
                            <Link to="/" onClick={() => setIsMenuOpen(false)}>
                                <li className="text-slate-700 hover:underline">Home</li>
                            </Link>
                            {/* --- 2. ADDED PROPERTIES LINK FOR MOBILE --- */}
                            <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                                <li className="text-slate-700 hover:underline">Properties</li>
                            </Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                                <li className="text-slate-700 hover:underline">About</li>
                            </Link>
                            <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                                <li className="text-slate-700 hover:underline">Sign in</li>
                            </Link>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
