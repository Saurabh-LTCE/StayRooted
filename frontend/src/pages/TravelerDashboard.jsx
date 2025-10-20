import React, { useEffect, useState } from 'react';
import TravelerSidebar from '../components/TravelerSidebar';
import axios from 'axios';
import { CalendarCheck2, History, Ban, Plane } from 'lucide-react';

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className={`bg-white rounded border p-4 flex items-center gap-4`}>
      <div className={`p-3 rounded-full ${color} text-white`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

function TravelerDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState({ stats: { totalTrips: 0, upcomingCount: 0, pastCount: 0, cancelledCount: 0 }, upcoming: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const token = localStorage.getItem('sr_token');
        const res = await axios.get('/api/dashboard/traveler/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (e) {
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-4">
      <div className="md:grid md:grid-cols-[16rem,1fr] gap-4">
        <TravelerSidebar />
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-green-800">Traveler Dashboard</h1>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Plane} label="Total Trips" value={data.stats.totalTrips} color="bg-green-600" />
            <StatCard icon={CalendarCheck2} label="Upcoming" value={data.stats.upcomingCount} color="bg-blue-600" />
            <StatCard icon={History} label="Past" value={data.stats.pastCount} color="bg-amber-600" />
            <StatCard icon={Ban} label="Cancelled" value={data.stats.cancelledCount} color="bg-rose-600" />
          </div>

          <div className="bg-white rounded border">
            <div className="p-4 border-b font-medium">Upcoming bookings</div>
            <div className="divide-y">
              {loading ? (
                <div className="p-4 text-gray-500">Loading...</div>
              ) : data.upcoming.length === 0 ? (
                <div className="p-4 text-gray-500">No upcoming bookings</div>
              ) : (
                data.upcoming.slice(0, 5).map(b => (
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

export default TravelerDashboard;


