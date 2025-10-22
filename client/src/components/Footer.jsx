import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'; // Using react-icons we already installed

export default function Footer() {
    return (
        // 'bg-slate-800' gives a dark, modern background
        // 'text-slate-300' provides a soft, light-colored text that's easy to read
        // 'p-8' gives it plenty of internal padding
        <footer className="bg-slate-800 text-slate-300 p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* --- Column 1: About --- */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Ruban Estate</h3>
                    <p className="text-sm">
                        Find your next perfect place with ease. We have a wide range of
                        properties for you to choose from.
                    </p>
                    <p className="text-xs mt-4">
                        &copy; {new Date().getFullYear()} Ruban Estate. All rights reserved.
                    </p>
                </div>

                {/* --- Column 2: Quick Links --- */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/about" className="text-sm hover:underline">About Us</Link>
                        </li>
                        <li>
                            <Link to="/search" className="text-sm hover:underline">Search Properties</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-sm hover:underline">Contact</Link>
                        </li>
                    </ul>
                </div>

                {/* --- Column 3: Follow Us --- */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                    <div className="flex gap-4">
                        <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-white">
                            <FaGithub />
                        </a>
                        <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-white">
                            <FaLinkedin />
                        </a>
                        <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-white">
                            <FaTwitter />
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
