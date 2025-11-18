import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import livityLogo from '../assets/LOGO.png';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // ❗ Temporary login state (later connect with real auth)
    const currentUser = null; // change to {} to test logged-in mode

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 h-16">

                {/* Logo */}
                <Link to="/">
                    <img src={livityLogo} alt="Livity Logo" className="h-10 object-contain" />
                </Link>

                {/* --- DESKTOP NAVIGATION --- */}
                <nav className="hidden sm:flex items-center">
                    <ul className="flex gap-6 items-center">

                        {/* Home Link */}
                        <Link to="/">
                            <li className="text-slate-700 hover:text-blue-600 transition duration-300">
                                Home
                            </li>
                        </Link>

                        {/* Properties */}
                        <Link to="/search">
                            <li className="text-slate-700 hover:text-blue-600 transition duration-300">
                                Properties
                            </li>
                        </Link>

                        {/* About */}
                        <Link to="/about">
                            <li className="text-slate-700 hover:text-blue-600 transition duration-300">
                                About
                            </li>
                        </Link>

                        {/* + ADD PROPERTY BUTTON (Everyone sees it) */}
                        <Link to={currentUser ? "/add-property" : "/sign-in"}>
                            <li className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition duration-300">
                                + Add Property
                            </li>
                        </Link>

                        {/* SHOW Profile if logged-in, else show SignUp */}
                        {currentUser ? (
                            <Link to="/profile">
                                <li className="text-slate-700 hover:text-blue-600 transition duration-300">
                                    Profile
                                </li>
                            </Link>
                        ) : (
                            <Link to="/sign-up">
                                <li className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300">
                                    SignUp
                                </li>
                            </Link>
                        )}
                    </ul>
                </nav>

                {/* MOBILE MENU ICON */}
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

                            <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                                <li className="text-slate-700 hover:underline">Properties</li>
                            </Link>

                            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                                <li className="text-slate-700 hover:underline">About</li>
                            </Link>

                            {/* MOBILE Add Property */}
                            <Link
                                to={currentUser ? "/add-property" : "/sign-in"}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <li className="text-white bg-black px-4 py-2 rounded-md">
                                    + Add Property
                                </li>
                            </Link>

                            {/* SIGN IN / PROFILE */}
                            {currentUser ? (
                                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                                    <li className="text-slate-700 hover:underline">Profile</li>
                                </Link>
                            ) : (
                                <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                                    <li className="bg-blue-600 text-white px-4 py-2 rounded-md">
                                        Sign Up
                                    </li>
                                </Link>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
