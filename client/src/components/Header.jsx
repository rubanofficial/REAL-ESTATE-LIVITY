import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import livityLogo from '../assets/LOGO.png';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // read user from localStorage
    const currentUser = localStorage.getItem("user");

    // Add Property handler
    const handleAddPropertyClick = () => {
        if (currentUser) {
            navigate('/add-property');
        } else {
            navigate('/sign-in', { state: { redirectTo: '/add-property' } });
        }
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 h-16">

                {/* LOGO */}
                <Link to="/">
                    <img
                        src={livityLogo}
                        alt="Livity Logo"
                        className="h-10 object-contain"
                    />
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden sm:flex items-center">
                    <ul className="flex gap-6 items-center">

                        <Link to="/">
                            <li className="text-slate-700 hover:text-blue-600 transition">
                                Home
                            </li>
                        </Link>

                        <Link to="/search">
                            <li className="text-slate-700 hover:text-blue-600 transition">
                                Properties
                            </li>
                        </Link>



                        {/* ❤️ Wishlist */}
                        {currentUser && (
                            <Link to="/wishlist">
                                <li className="flex items-center gap-1 text-slate-700 hover:text-red-500 transition">
                                    <FaHeart className="text-red-500" />
                                    Wishlist
                                </li>
                            </Link>
                        )}

                        {/* ➕ Add Property */}
                        <li
                            onClick={handleAddPropertyClick}
                            className="bg-black cursor-pointer text-white px-4 py-2 rounded-md hover:bg-gray-900 transition"
                        >
                            + Add Property
                        </li>

                        {/* AUTH LINKS */}
                        {currentUser ? (
                            <>
                                <Link to="/profile">
                                    <li className="text-slate-700 hover:text-blue-600 transition">
                                        Profile
                                    </li>
                                </Link>

                                <li
                                    onClick={handleLogout}
                                    className="cursor-pointer text-red-600 font-semibold hover:text-red-700 transition"
                                >
                                    Logout
                                </li>
                            </>
                        ) : (
                            <Link to="/sign-up">
                                <li className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                                    Sign Up
                                </li>
                            </Link>
                        )}
                    </ul>
                </nav>

                {/* MOBILE MENU ICON */}
                <div className="sm:hidden">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-slate-700 text-2xl"
                    >
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU */}
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
                                <li className="text-slate-700 hover:underline">
                                    Home
                                </li>
                            </Link>

                            <Link to="/search" onClick={() => setIsMenuOpen(false)}>
                                <li className="text-slate-700 hover:underline">
                                    Properties
                                </li>
                            </Link>

                            {/* ❤️ Wishlist (Mobile) */}
                            {currentUser && (
                                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <FaHeart className="text-red-500" />
                                        Wishlist
                                    </li>
                                </Link>
                            )}

                            {/* ➕ Add Property */}
                            <li
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleAddPropertyClick();
                                }}
                                className="text-white bg-black px-4 py-2 rounded-md cursor-pointer"
                            >
                                + Add Property
                            </li>

                            {/* AUTH */}
                            {currentUser ? (
                                <li
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="cursor-pointer text-red-600 font-semibold"
                                >
                                    Logout
                                </li>
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
