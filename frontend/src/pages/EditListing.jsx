import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', location: '', price: '', image: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListing() {
      setLoading(true);
      try {
        const resp = await fetch(`/api/listings/${id}`);
        const data = await resp.json();
        setForm({
          title: data.title || '',
          description: data.description || '',
          location: data.location || '',
          price: data.price || '',
          image: data.images && data.images[0] || '',
        });
      } catch {
        setError('Error loading listing.');
      }
      setLoading(false);
    }
    fetchListing();
  }, [id]);

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
    if (!form.title || !form.description || !form.location || !form.price) {
      setError('All fields required');
      return;
    }
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      price: parseFloat(form.price),
      images: form.image ? [form.image] : [],
    };
    try {
      const resp = await fetch(`/api/listings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!resp.ok) {
        setError('Error updating listing.');
        return;
      }
      navigate('/dashboard');
    } catch {
      setError('Server error updating listing');
    }
  };

  if (loading) return <div className="max-w-xl mx-auto mt-12 p-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white rounded shadow p-8">
      <h2 className="text-2xl font-bold mb-6 text-green-800">Edit Listing</h2>
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
          {(form.image && !imagePreview) && <div className="text-xs text-gray-500">Current: {form.image}</div>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="h-32 object-cover rounded border" />}
        </div>
        <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition">Update Listing</button>
      </form>
    </div>
  );
}

export default EditListing;
