import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import livityLogo from "../assets/LOGO.png";

export default function SignIn() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            setError("");

            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Invalid credentials");
                setLoading(false);
                return;
            }

            localStorage.setItem("user", "logged-in");
            navigate("/");
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* LEFT SIDE – BRAND / INFO */}
            <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10">
                <img src={livityLogo} alt="Livity" className="h-14 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Welcome Back</h1>
                <p className="text-lg text-center max-w-md opacity-90">
                    Sign in to manage your properties, track listings, and connect with buyers.
                </p>
            </div>

            {/* RIGHT SIDE – FORM */}
            <div className="flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
                    <p className="text-gray-500 mb-6">
                        Enter your credentials to continue
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Email</label>
                            <input
                                type="email"
                                id="email"
                                required
                                onChange={handleChange}
                                className="w-full border p-3 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-600">Password</label>
                            <input
                                type="password"
                                id="password"
                                required
                                onChange={handleChange}
                                className="w-full border p-3 rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            disabled={loading}
                            className="mt-4 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    {error && (
                        <p className="mt-4 text-red-600 bg-red-100 p-3 rounded-md text-sm">
                            {error}
                        </p>
                    )}

                    <p className="mt-6 text-sm text-gray-600">
                        Don’t have an account?{" "}
                        <Link to="/sign-up" className="text-blue-600 font-medium">
                            Create one
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
