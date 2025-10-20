import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';

function HostDashboard() {
  const [stats, setStats] = useState({ listings: 0, bookings: 0, earnings: 0 });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = useMemo(() => localStorage.getItem('sr_token'), []);

  const fetchAll = async () => {
    try {
      setError('');
      setLoading(true);
      const [dRes, bRes] = await Promise.all([
        axios.get('/api/host/dashboard', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/host/bookings', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setStats(dRes.data.totals || { listings: 0, bookings: 0, earnings: 0 });
      setBookings(bRes.data.bookings || []);
    } catch (e) {
      setError('Failed to load host data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/host/bookings/${id}/status`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      fetchAll();
    } catch (e) {
      setError('Failed to update booking');
    }
  };

  // New Listing form state
  const [form, setForm] = useState({ title: '', description: '', location: '', price: '', images: [''] });
  const [creating, setCreating] = useState(false);
  const onChange = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const submitListing = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const body = { title: form.title, description: form.description, location: form.location, price: Number(form.price), images: form.images.filter(Boolean) };
      await axios.post('/api/listings', body, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
      setForm({ title: '', description: '', location: '', price: '', images: [''] });
      fetchAll();
    } catch (e) {
      setError('Failed to create listing');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 space-y-6">
      <h2 className="text-3xl font-bold text-green-800">Host Dashboard</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-600">Listings</div>
          <div className="text-2xl font-bold">{stats.listings}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-600">Bookings</div>
          <div className="text-2xl font-bold">{stats.bookings}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-gray-600">Earnings</div>
          <div className="text-2xl font-bold">₹{stats.earnings}</div>
        </div>
      </div>

      <div className="bg-white border rounded">
        <div className="p-4 border-b font-medium">Bookings</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-600">
                <th className="p-3">Date</th>
                <th className="p-3">Traveler</th>
                <th className="p-3">Listing</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-gray-500">Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan="6" className="p-4 text-gray-500">No bookings</td></tr>
              ) : (
                bookings.map(b => (
                  <tr key={b._id} className="border-b">
                    <td className="p-3">{b.checkIn || b.experienceDate ? format(parseISO(b.checkIn || b.experienceDate), 'PP') : '-'}</td>
                    <td className="p-3">{b.traveler?.name}</td>
                    <td className="p-3">{b.listing?.title}</td>
                    <td className="p-3">₹{b.totalPrice}</td>
                    <td className="p-3 capitalize">{b.status}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => updateStatus(b._id, 'confirmed')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Approve</button>
                      <button onClick={() => updateStatus(b._id, 'cancelled')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Decline</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white border rounded p-4">
        <div className="font-medium mb-3">New Listing</div>
        <form onSubmit={submitListing} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input value={form.title} onChange={onChange('title')} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input value={form.location} onChange={onChange('location')} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={onChange('description')} className="w-full border rounded px-3 py-2 min-h-[100px]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input type="number" min="0" value={form.price} onChange={onChange('price')} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input value={form.images[0]} onChange={(e)=>setForm(f=>({ ...f, images: [e.target.value] }))} className="w-full border rounded px-3 py-2" />
          </div>
          <div className="md:col-span-2">
            <button disabled={creating} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-60">
              {creating ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HostDashboard;
