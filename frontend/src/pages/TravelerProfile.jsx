import React, { useEffect, useState } from 'react';
import TravelerSidebar from '../components/TravelerSidebar';
import axios from 'axios';

function TravelerProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '', avatar: '' });

  useEffect(() => {
    const run = async () => {
      try {
        setError('');
        const token = localStorage.getItem('sr_token');
        const res = await axios.get('/api/dashboard/traveler/profile', { headers: { Authorization: `Bearer ${token}` } });
        const u = res.data.user || {};
        setForm({ name: u.name || '', email: u.email || '', phone: u.phone || '', bio: u.bio || '', avatar: u.avatar || '' });
      } catch (e) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const onChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      const token = localStorage.getItem('sr_token');
      const { name, phone, bio, avatar } = form;
      const res = await axios.put('/api/dashboard/traveler/profile', { name, phone, bio, avatar }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Profile updated');
      const u = res.data.user || {};
      setForm(f => ({ ...f, name: u.name || f.name, phone: u.phone || f.phone, bio: u.bio || f.bio, avatar: u.avatar || f.avatar }));
    } catch (e) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="md:grid md:grid-cols-[16rem,1fr] gap-4">
        <TravelerSidebar />
        <div>
          <h1 className="text-2xl font-bold text-green-800 mb-4">Profile</h1>
          <div className="bg-white rounded border p-4 max-w-2xl">
            {error && <div className="mb-3 text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded">{error}</div>}
            {success && <div className="mb-3 text-green-800 bg-green-50 border border-green-200 px-3 py-2 rounded">{success}</div>}
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input value={form.name} onChange={onChange('name')} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input value={form.email} disabled className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input value={form.phone} onChange={onChange('phone')} className="w-full border rounded px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  <textarea value={form.bio} onChange={onChange('bio')} className="w-full border rounded px-3 py-2 min-h-[100px]" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Picture URL</label>
                  <input value={form.avatar} onChange={onChange('avatar')} className="w-full border rounded px-3 py-2" />
                </div>
                <div className="flex items-center gap-4">
                  {form.avatar ? (
                    <img src={form.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 border" />
                  )}
                  <button type="submit" disabled={saving} className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelerProfile;


