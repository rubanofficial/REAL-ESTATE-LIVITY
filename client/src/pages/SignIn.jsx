import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import livityLogo from '../assets/LOGO.png'; // Make sure this path is correct
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

export default function SignIn() {
    // State to hold form data
    const [formData, setFormData] = useState({});
    // State for error messages
    const [error, setError] = useState(null);
    // State for loading status
    const [loading, setLoading] = useState(false);
    // Hook to redirect user
    const navigate = useNavigate();

    // Updates state when user types
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // Runs when form is submitted
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop page from reloading
        try {
            setLoading(true);
            setError(null);

            // --- 1. THIS IS THE REAL API CALL ---
            // We are sending the formData to our backend
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            // Get the response from the server (user data or error message)
            const data = await res.json();

            // --- 2. REMOVED THE SIMULATION BLOCK ---

            // 3. Check for errors sent from our backend
            // Our backend error handler sends 'success: false'
            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return; // Stop the function
            }

            // 4. If successful:
            setLoading(false);
            console.log('Login Success! User data:', data); // Log the user data
            navigate('/'); // Redirect to home page

        } catch (error) {
            // This catches network errors (e.g., server is down)
            setLoading(false);
            setError('An error occurred. Please try again.');
        }
    };

    // Placeholder for Google login
    const handleGoogleClick = () => {
        console.log('Google login clicked!');
    };

    return (
        // Full-page container
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            {/* Main animated card */}
            <motion.div
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* --- Image Side --- */}
                <div
                    className="hidden md:block md:w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529539795054-3c162a44b490?q=80&w=2070&auto=format&fit=crop')" }}
                >
                </div>

                {/* --- Form Side --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex justify-center mb-4">
                        <img src={livityLogo} alt="Livity Logo" className="h-12 object-contain" />
                    </div>
                    <h1 className="text-3xl text-center font-bold text-slate-800 mb-6">
                        Welcome Back!
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>

                        <div className="flex items-center gap-2 my-2">
                            <div className="flex-grow border-t border-slate-300"></div>
                            <span className="text-slate-400 text-sm">OR</span>
                            <div className="flex-grow border-t border-slate-300"></div>
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

