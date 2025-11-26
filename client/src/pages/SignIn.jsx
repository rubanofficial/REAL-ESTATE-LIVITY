import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import livityLogo from "../assets/LOGO.png";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";

export default function SignIn() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const redirectPath = location.state?.redirectTo || "/";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const API_BASE = import.meta.env.DEV
                ? "http://localhost:10000"
                : import.meta.env.VITE_BACKEND_URL;

            const res = await fetch(`${API_BASE}/api/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include", // 🔥 needed for JWT cookie
            });

            const data = await res.json();

            // 🔥 CHECK FOR BACKEND ERRORS (401, 404, 500)
            if (!res.ok) {
                setError(data.message || "Invalid email or password");
                setLoading(false);
                return;
            }

            // SUCCESS → login and redirect
            localStorage.setItem("user", "logged-in");

            setLoading(false);
            navigate(redirectPath, { replace: true });

        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong. Try again.");
            setLoading(false);
        }
    };

    const handleGoogleClick = () => {
        console.log("Google login clicked!");
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            <motion.div
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div
                    className="hidden md:block md:w-1/2 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1529539795054-3c162a44b490?q=80&w=2070&auto=format&fit=crop')",
                    }}
                />

                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex justify-center mb-4">
                        <img
                            src={livityLogo}
                            alt="Livity Logo"
                            className="h-12 object-contain"
                        />
                    </div>
                    <h1 className="text-3xl text-center font-bold text-slate-800 mb-6">
                        Welcome Back!
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />

                        <button
                            disabled={loading}
                            className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:bg-blue-700 transition duration-300 disabled:opacity-80"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>

                        <div className="flex items-center gap-2 my-2">
                            <div className="flex-grow border-t border-slate-300" />
                            <span className="text-slate-400 text-sm">OR</span>
                            <div className="flex-grow border-t border-slate-300" />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleClick}
                            className="w-full bg-white border border-slate-300 text-slate-700 p-3 rounded-lg uppercase hover:bg-slate-50 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <FaGoogle className="text-red-500" />
                            Continue with Google
                        </button>
                    </form>

                    <div className="flex gap-2 mt-5 justify-center">
                        <p className="text-slate-600">Don't have an account?</p>
                        <Link to="/sign-up" className="text-blue-600 hover:underline">
                            Sign up
                        </Link>
                    </div>

                    {error && (
                        <p className="text-red-500 mt-5 text-center bg-red-100 p-3 rounded-lg">
                            {error}
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
