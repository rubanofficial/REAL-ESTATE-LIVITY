import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import livityLogo from '../assets/LOGO.png'; // 1. We'll use the logo
import { motion } from 'framer-motion'; // 2. For animation
import { FaGoogle } from 'react-icons/fa'; // 3. For the Google button

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // This hook from react-router-dom lets us redirect the user
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

            // --- 4. THIS IS OUR FUTURE API CALL ---
            // We are *preparing* the code for our backend
            // const res = await fetch('/api/auth/signup', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formData),
            // });
            // const data = await res.json();

            // --- For now, we simulate a successful API call ---
            await new Promise(resolve => setTimeout(resolve, 1000));
            const data = { success: true }; // Simulate success
            // --- End of simulation ---

            if (data.success === false) {
                // setError(data.message); // This will be used when API is live
                throw new Error('Simulation Error: Something went wrong'); // For demo
            }
            setLoading(false);
            navigate('/sign-in'); // Redirect to sign-in on success
        } catch (error) {
            setLoading(false);
            setError('Something went wrong. Please try again.');
        }
    };

    // 5. Placeholder for our Google OAuth flow
    const handleGoogleClick = () => {
        console.log('Google login clicked! We will wire this up later.');
    };

    return (
        // Full-page container
        <div className="min-h-screen bg-slate-100 py-10 px-4">
            {/* 6. Main card: 'shadow-2xl' for a strong shadow, 'rounded-xl', 'overflow-hidden' */}
            <motion.div
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >

                {/* --- 7. Image Side (Hidden on Mobile) --- */}
                <div
                    className="hidden md:block md:w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop')" }}
                >
                    {/* This div is just for the background image */}
                </div>

                {/* --- 8. Form Side --- */}
                <div className="w-full md:w-1/2 p-8 md:p-12">
                    <div className="flex justify-center mb-4">
                        <img src={livityLogo} alt="Livity Logo" className="h-12 object-contain" />
                    </div>
                    <h1 className="text-3xl text-center font-bold text-slate-800 mb-6">
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
                            {loading ? 'Loading...' : 'Sign Up'}
                        </button>

                        {/* --- 9. "OR" Separator --- */}
                        <div className="flex items-center gap-2 my-2">
                            <div className="flex-grow border-t border-slate-300"></div>
                            <span className="text-slate-400 text-sm">OR</span>
                            <div className="flex-grow border-t border-slate-300"></div>
                        </div>

                        {/* --- 10. Google Sign-In Button --- */}
                        <button
                            type="button" // 'type="button"' is CRUCIAL to prevent it from submitting the form
                            onClick={handleGoogleClick}
                            className="w-full bg-white border border-slate-300 text-slate-700 p-3 rounded-lg uppercase hover:bg-slate-50 transition duration-300 flex items-center justify-center gap-2"
                        >
                            <FaGoogle className="text-red-500" />
                            Continue with Google
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
                </div>
            </motion.div>
        </div>
    );
}

