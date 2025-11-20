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

    // single image file + preview
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

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

    // handle single image selection and preview
    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError('Only image files allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError('Image must be <= 5MB');
            return;
        }
        setError('');
        setImage(file);

        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);

        // reset input so same file can be selected again if needed
        e.target.value = '';
    };

    // remove selected image
    const removeImage = () => {
        setImage(null);
        setPreview(null);
    };

    // simple validation
    const validate = () => {
        if (!form.title.trim()) return 'Title is required';
        if (!form.price || Number(form.price) <= 0) return 'Enter valid price';
        if (!form.address.city.trim()) return 'City is required';
        if (!image) return 'Add 1 image';
        return null;
    };

    // submit -> send FormData to backend
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
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('description', form.description);
            fd.append('price', String(form.price));
            fd.append('currency', form.currency);
            fd.append('type', form.type);
            fd.append('furnished', String(form.furnished));
            fd.append('bedrooms', String(form.bedrooms));
            fd.append('bathrooms', String(form.bathrooms));
            fd.append('areaSqFt', String(form.areaSqFt || ''));
            fd.append('address', JSON.stringify(form.address));
            // single image key 'image' (backend should use upload.single('image'))
            fd.append('image', image);

            const res = await fetch('/api/listings/create', {
                method: 'POST',
                body: fd,
                credentials: 'include' // send httpOnly cookie for auth
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message || 'Create failed');

            navigate(`/listing/${data.property._id}`);
        } catch (err) {
            console.error(err);
            setError(err.message || 'Submit failed');
        } finally {
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
                    <label className="block mb-1 font-medium">Image (single, ≤ 5MB)</label>
                    <input type="file" accept="image/*" onChange={handleFile} />
                    {preview && (
                        <div className="mt-3 relative inline-block">
                            <img src={preview} alt="preview" className="h-32 w-48 object-cover rounded" />
                            <button type="button" onClick={removeImage} className="absolute top-1 right-1 bg-black text-white rounded-full w-6 h-6 text-xs">×</button>
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
