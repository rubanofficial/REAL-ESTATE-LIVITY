import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddPropertyStep2() {
    const navigate = useNavigate();

    // form state
    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'INR',
        type: 'sale',
        furnished: false,
        bedrooms: 1,
        bathrooms: 1,
        areaSqFt: '',
        address: { street: '', city: '', state: '', postalCode: '' }
    });

    // images: File objects
    const [images, setImages] = useState([]);
    // previews: data URLs to show thumbnails
    const [previews, setPreviews] = useState([]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // update simple fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('address.')) {
            const key = name.split('.')[1];
            setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
        } else if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
    };

    // handle image selection and generate previews
    const handleFiles = (e) => {
        const files = Array.from(e.target.files || []);
        // basic client-side validation: limit & type & size
        const maxFiles = 8;
        if (files.length + images.length > maxFiles) {
            setError(`Max ${maxFiles} images allowed`);
            return;
        }
        const valid = [];
        const newPreviews = [];
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Only image files allowed');
                continue;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setError('Each image must be <= 5MB');
                continue;
            }
            valid.push(file);
            // create preview
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreviews(prev => [...prev, ev.target.result]);
            };
            reader.readAsDataURL(file);
        }
        setImages(prev => [...prev, ...valid]);
        // clear previous error if ok
        if (valid.length) setError('');
        // reset file input value (if you want to re-select same file)
        e.target.value = '';
    };

    // remove selected image by index
    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // simple client-side validation before submit
    const validate = () => {
        if (!form.title.trim()) return 'Title is required';
        if (!form.price || Number(form.price) <= 0) return 'Enter valid price';
        if (!form.address.city.trim()) return 'City is required';
        if (images.length < 1) return 'Add at least 1 image';
        return null;
    };

    // submit handler (no server call yet)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        setLoading(true);
        try {
            // NEXT STEP: send FormData to backend (we'll implement later)
            // for now just simulate success and navigate to a placeholder page
            setTimeout(() => {
                setLoading(false);
                navigate('/'); // after success go to home
            }, 800);
        } catch (err) {
            setError('Failed to submit');
            setLoading(false);
        }
    };

    return (
        <main className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Create Listing</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Title (e.g., 3BHK near Anna Salai)"
                    className="w-full p-2 border rounded"
                />

                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    rows={5}
                />

                <div className="grid grid-cols-2 gap-3">
                    <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded" />
                    <select name="currency" value={form.currency} onChange={handleChange} className="p-2 border rounded">
                        <option>INR</option>
                        <option>USD</option>
                    </select>
                </div>

                <div className="flex gap-3 items-center">
                    <select name="type" value={form.type} onChange={handleChange} className="p-2 border rounded">
                        <option value="sale">Sale</option>
                        <option value="rent">Rent</option>
                    </select>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="furnished" checked={form.furnished} onChange={handleChange} />
                        Furnished
                    </label>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <input name="bedrooms" value={form.bedrooms} onChange={handleChange} type="number" min={1} className="p-2 border rounded" />
                    <input name="bathrooms" value={form.bathrooms} onChange={handleChange} type="number" min={1} className="p-2 border rounded" />
                    <input name="areaSqFt" value={form.areaSqFt} onChange={handleChange} placeholder="Area (sqft)" className="p-2 border rounded" />
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Address</h3>
                    <input name="address.street" value={form.address.street} onChange={handleChange} placeholder="Street" className="w-full p-2 border rounded" />
                    <div className="grid grid-cols-3 gap-3">
                        <input name="address.city" value={form.address.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />
                        <input name="address.state" value={form.address.state} onChange={handleChange} placeholder="State" className="p-2 border rounded" />
                        <input name="address.postalCode" value={form.address.postalCode} onChange={handleChange} placeholder="PIN" className="p-2 border rounded" />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">Images (max 8, each ≤ 5MB)</label>
                    <input type="file" multiple accept="image/*" onChange={handleFiles} />
                    {previews.length > 0 && (
                        <div className="mt-3 grid grid-cols-4 gap-2">
                            {previews.map((p, i) => (
                                <div key={i} className="relative">
                                    <img src={p} alt={`preview-${i}`} className="h-24 w-full object-cover rounded" />
                                    <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-xs">×</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {error && <div className="text-red-600">{error}</div>}

                <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
                        {loading ? 'Saving...' : 'Save & Continue'}
                    </button>
                    <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border rounded">Cancel</button>
                </div>
            </form>
        </main>
    );
}
