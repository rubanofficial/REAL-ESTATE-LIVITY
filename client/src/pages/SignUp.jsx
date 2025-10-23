import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
    // 1. Create state to hold the form's data
    const [formData, setFormData] = useState({});

    // 2. Create state for loading and error feedback
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // 3. This is the "Controlled Component" handler.
    // It updates our 'formData' state every time a user types in an input
    const handleChange = (e) => {
        // [e.target.id] is a dynamic key. It uses the 'id' of the input (e.g., 'username', 'email')
        // to update the correct field in our state object.
        setFormData({
            ...formData, // Keep the old values
            [e.target.id]: e.target.value, // Add the new/updated value
        });
    };

    // 4. This function runs when the user submits the form
    const handleSubmit = (e) => {
        // This STOPS the browser from refreshing the page, which is the default HTML form behavior.
        e.preventDefault();

        // For now, let's just log our state to the console to see if it works
        console.log('Form data being submitted:', formData);

        // --- THIS IS WHERE OUR BACKEND LOGIC WILL GO (in the next step) ---
        // try {
        //   setLoading(true);
        //   const res = await fetch('/api/auth/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData),
        //   });
        //   const data = await res.json();
        //   if (data.success === false) {
        //     setError(data.message);
        //     setLoading(false);
        //     return;
        //   }
        //   setLoading(false);
        //   setError(null);
        //   // We will navigate the user to the Sign In page
        //   // navigate('/sign-in');
        // } catch (error) {
        //   setLoading(false);
        //   setError(error.message);
        // }
    };

    return (
        <div className="p-3 max-w-lg mx-auto">
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
            {/* 5. Show the error message if 'error' state is not null */}
            {error && <p className="text-red-500 mt-5">{error}</p>}
        </div>
    );
}
