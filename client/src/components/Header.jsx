// src/components/Header/Header.jsx

import React from 'react';

export default function Header() {
    return (
        // 'shadow-md' adds a nice box shadow, 'p-4' adds padding
        <header className="bg-slate-200 shadow-md">
            {/* 'justify-between' puts space between items, 'items-center' vertically aligns them */}
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                {/* 'font-bold' makes text bold, 'text-xl' makes it extra large */}
                <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                    <span className="text-slate-500">Ruban</span>
                    <span className="text-slate-700">Estate</span>
                </h1>
                <nav>
                    {/* 'flex' creates a row, 'gap-4' adds space between items */}
                    <ul className="flex gap-4">
                        <li className="hidden sm:inline text-slate-700 hover:underline">Home</li>
                        <li className="hidden sm:inline text-slate-700 hover:underline">About</li>
                        <li className="text-slate-700 hover:underline">Sign in</li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}