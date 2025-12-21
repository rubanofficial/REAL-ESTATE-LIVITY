import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import livityLogo from "../assets/LOGO.png";
import { motion } from "framer-motion";

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_BASE = import.meta.env.VITE_BACKEND_URL;

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

            const res = await fetch(`${API_BASE}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
                credentials: "include", // ✅ REQUIRED
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
            setError("Network error. Please try again.");
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
                    <img src={livityLogo} alt="Livity Logo" className="h-12" />
                </div>

                <h1 className="text-3xl text-center font-semibold my-7">
                    Create Your Account
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username"
                        id="username"
                        onChange={handleChange}
                        required
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        onChange={handleChange}
                        required
                        className="border p-3 rounded-lg"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        id="password"
                        onChange={handleChange}
                        required
                        className="border p-3 rounded-lg"
                    />

                    <button
                        disabled={loading}
                        className="bg-blue-600 text-white p-3 rounded-lg"
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <div className="flex gap-2 mt-5 justify-center">
                    <p>Have an account?</p>
                    <Link to="/sign-in" className="text-blue-600">
                        Sign in
                    </Link>
                </div>

                {error && (
                    <p className="text-red-600 mt-5 text-center bg-red-100 p-3 rounded-lg">
                        {error}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
