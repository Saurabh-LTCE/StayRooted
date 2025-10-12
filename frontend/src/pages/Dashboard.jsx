import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

function getAllBookings() {
  // demo: return all as if host can see all bookings
  return JSON.parse(localStorage.getItem('myBookings')) || [];
}

function Dashboard() {
  const [requests, setRequests] = useState([]);
  useEffect(() => {
    setRequests(getAllBookings());
  }, []);

  // Demo: Approve/cancel booking (mock, just local state)
  const setStatus = (idx, status) => {
    const updated = requests.map((b, i) => i===idx ? { ...b, status } : b);
    setRequests(updated);
    localStorage.setItem('myBookings', JSON.stringify(updated));
  };
  return (
    <div className="max-w-3xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Host Dashboard: Incoming Booking Requests</h2>
      <div className="space-y-6">
        {requests.length === 0 ? (
          <div className="bg-white p-8 rounded shadow">No incoming requests.</div>
        ) : (
          requests.map((b, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
              <div>
                <div className="font-semibold">{b.listing.title}</div>
                <div className="text-gray-600 text-sm">Dates: {format(new Date(b.startDate), 'PP')} → {format(new Date(b.endDate), 'PP')}</div>
                <div className="text-sm">Guests: {b.guests}</div>
                <div className="text-xs text-gray-400 mt-1">Booked at: {format(new Date(b.bookedAt), 'PPpp')}</div>
                <div className={`mt-2 font-medium px-3 py-1 rounded-full inline-block text-xs ${b.status === 'Cancelled' ? 'bg-red-100 text-red-600' : b.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status || 'Pending'}</div>
              </div>
              <div className="flex space-x-3">
                {b.status !== 'Approved' && b.status !== 'Cancelled' && <button onClick={() => setStatus(idx, 'Approved')} className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800 text-sm">Approve</button>}
                {b.status !== 'Cancelled' && <button onClick={() => setStatus(idx, 'Cancelled')} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Cancel</button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
