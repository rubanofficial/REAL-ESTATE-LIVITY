import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import livityLogo from '../assets/LOGO.png'; // 1. Import the logo image

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data being submitted:', formData);
        // (Your backend submission logic will go here)
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
            {/* 2. Display the logo above the heading */}
            <div className="flex justify-center mb-6"> {/* Centering div for the logo */}
                <img src={livityLogo} alt="Livity Logo" className="h-12 sm:h-16 object-contain" />
            </div>

            <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="border p-3 rounded-lg"
                    id="username"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="border p-3 rounded-lg"
                    id="email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="border p-3 rounded-lg"
                    id="password"
                    onChange={handleChange}
                />
                <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
                >
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
            </form>
            <div className="flex gap-2 mt-5">
                <p>Have an account?</p>
                <Link to="/sign-in" className="text-blue-700 hover:underline">
                    Sign in
                </Link>
            </div>
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    );
}

