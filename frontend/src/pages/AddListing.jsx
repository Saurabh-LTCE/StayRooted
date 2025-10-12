import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MOCK_HOST_ID = 'replace-with-your-host-objectid';

function AddListing() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    image: '',
  });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, image: file.name }));
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Basic validation
    if (!form.title || !form.description || !form.location || !form.price) {
      setError('All fields are required');
      return;
    }
    // POST to backend
    const payload = {
      ...form,
      price: parseFloat(form.price),
      images: form.image ? [form.image] : [],
      host: MOCK_HOST_ID,
      latitude: 0,
      longitude: 0,
      type: 'Homestay',
    };
    try {
      const resp = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const data = await resp.json();
        setError(data.error || 'Error creating listing');
        return;
      }
      navigate('/dashboard');
    } catch (err) {
      setError('Server error.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Add New Listing</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <div className="bg-red-100 text-red-700 rounded px-3 py-2">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input name="title" className="w-full border rounded px-3 py-2" value={form.title} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea name="description" rows={3} className="w-full border rounded px-3 py-2" value={form.description} onChange={handleChange}/>
        </div>
        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input name="location" className="w-full border rounded px-3 py-2" value={form.location} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Price (INR per night)</label>
          <input name="price" type="number" min="0" className="w-full border rounded px-3 py-2" value={form.price} onChange={handleChange} />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image</label>
          <input name="image" type="file" accept="image/*" onChange={handleFile} className="mb-2"/>
          {imagePreview && <img src={imagePreview} alt="Preview" className="h-32 object-cover rounded border" />}
        </div>
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">Add Listing</button>
      </form>
    </div>
  );
}

export default AddListing;
