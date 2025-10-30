import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import livityLogo from '../assets/LOGO.png';
import { motion } from 'framer-motion';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            // 🧠 Debug: Log the backend URL before calling it
            console.log("🔗 Sending signup request to:", import.meta.env.VITE_BACKEND_URL);

            // --- Send form data to backend ---
            const res = await fetch("https://rems-backend-gfbp.onrender.com/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });


            const data = await res.json();
            console.log("📦 Response data:", data);

            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }

            setLoading(false);
            navigate('/');
        } catch (error) {
            console.error("🚨 Signup Error:", error);
            setLoading(false);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="p-3 max-w-lg mx-auto min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex justify-center mt-10 mb-6">
                    <img src={livityLogo} alt="Livity Logo" className="h-12 object-contain" />
                </div>
                <h1 className="text-3xl text-center font-semibold my-7 text-slate-800">
                    Create Your Account
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="email"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="password"
                        onChange={handleChange}
                        required
                    />
                    <button
                        disabled={loading}
                        className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 transition duration-300 disabled:opacity-80"
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <div className="flex gap-2 mt-5 justify-center">
                    <p className="text-slate-600">Have an account?</p>
                    <Link to="/sign-in" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </div>
                {error && (
                    <p className="text-red-500 mt-5 text-center bg-red-100 p-3 rounded-lg">
                        {error}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
