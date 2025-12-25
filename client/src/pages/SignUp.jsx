import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import livityLogo from "../assets/LOGO.png";
import { motion } from "framer-motion";

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

            const API_BASE = import.meta.env.DEV
                ? "http://localhost:10000"
                : import.meta.env.VITE_BACKEND_URL;

            const res = await fetch(`${API_BASE}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Signup failed");
                setLoading(false);
                return;
            }

            setLoading(false);
            navigate("/sign-in");
        } catch (err) {
            console.error("Signup error:", err);
            setLoading(false);
            setError("Something went wrong. Please try again.");
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
                        id="username"
                        required
                        onChange={handleChange}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        required
                        onChange={handleChange}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    {/* 📞 Phone Number */}
                    <input
                        type="tel"
                        placeholder="Phone Number"
                        id="phone"
                        required
                        onChange={handleChange}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        required
                        onChange={handleChange}
                        className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        disabled={loading}
                        className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-80"
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 mt-5 text-center bg-red-100 p-3 rounded-lg">
                        {error}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
