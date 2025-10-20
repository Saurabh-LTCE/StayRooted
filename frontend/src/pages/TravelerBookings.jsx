import React, { useEffect, useMemo, useState } from 'react';
import TravelerSidebar from '../components/TravelerSidebar';
import axios from 'axios';

function Tab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-t border-b-2 ${active ? 'border-green-700 text-green-800' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
    >
      {children}
    </button>
  );
}

function TravelerBookings() {
  const [active, setActive] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [] });

  useEffect(() => {
    const run = async () => {
      try {
        setError('');
        const token = localStorage.getItem('sr_token');
        const res = await axios.get('/api/dashboard/traveler/bookings', { headers: { Authorization: `Bearer ${token}` } });
        setBookings({ upcoming: res.data.upcoming, past: res.data.past, cancelled: res.data.cancelled });
      } catch (e) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const list = useMemo(() => bookings[active] || [], [bookings, active]);

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="md:grid md:grid-cols-[16rem,1fr] gap-4">
        <TravelerSidebar />
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-green-800">My Bookings</h1>
          <div className="bg-white rounded border">
            <div className="px-4 pt-4 flex gap-2 border-b">
              <Tab active={active === 'upcoming'} onClick={() => setActive('upcoming')}>Upcoming</Tab>
              <Tab active={active === 'past'} onClick={() => setActive('past')}>Past</Tab>
              <Tab active={active === 'cancelled'} onClick={() => setActive('cancelled')}>Cancelled</Tab>
            </div>
            {error && <div className="p-4 text-red-700 bg-red-50 border-b">{error}</div>}
            <div className="divide-y">
              {loading ? (
                <div className="p-4 text-gray-500">Loading...</div>
              ) : list.length === 0 ? (
                <div className="p-4 text-gray-500">No bookings</div>
              ) : (
                list.map(b => (
                  <div key={b._id} className="p-4 flex items-center gap-4">
                    <img
                      src={b.listing?.images?.[0] || b.experience?.images?.[0] || '/placeholder.png'}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{b.listing?.title || b.experience?.title}</div>
                      <div className="text-sm text-gray-600">{b.listing ? 'Stay' : 'Experience'} • {new Date(b.checkIn || b.experienceDate).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{b.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelerBookings;


