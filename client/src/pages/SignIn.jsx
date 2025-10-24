import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import livityLogo from '../assets/LOGO.png';
import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

export default function SignIn() {
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

            // --- THIS IS OUR FUTURE API CALL ---
            // const res = await fetch('/api/auth/signin', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData),
            // });
            // const data = await res.json();

            // --- For now, we simulate a successful API call ---
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = { success: true, user: { username: 'ruban' } }; // Simulate success
            // --- End of simulation ---

            if (data.success === false) {
                throw new Error('Simulation Error: Invalid credentials'); // For demo
            }
            setLoading(false);
            navigate('/'); // Redirect to home page on success
        } catch (error) {
            setLoading(false);
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleGoogleClick = () => {
        console.log('Google login clicked! We will wire this up later.');
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
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1529539795054-3c162a44b490?q=80&w=2070&auto=format&fit=crop')" }}
                >
                </div>
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex justify-center mb-4">
                        <img src={livityLogo} alt="Livity Logo" className="h-12 object-contain" />
                    </div>
                    <h1 className="text-3xl text-center font-bold text-slate-800 mb-6">
                        Welcome Back!
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* --- ONLY EMAIL AND PASSWORD ARE NEEDED --- */}
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
                        {/* --- LINK NOW GOES TO SIGN-UP --- */}
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