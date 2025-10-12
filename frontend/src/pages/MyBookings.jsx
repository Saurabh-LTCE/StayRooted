import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

function getBookings() {
  return JSON.parse(localStorage.getItem('myBookings')) || [];
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    setBookings(getBookings());
  }, []);

  // Demo: Cancel booking (just updates local state and storage)
  const handleCancel = (index) => {
    const updated = bookings.map((b, i) => i === index ? { ...b, status: 'Cancelled' } : b);
    setBookings(updated);
    localStorage.setItem('myBookings', JSON.stringify(updated));
  };

  if (!bookings.length) {
    return <div className="max-w-2xl mx-auto p-8">No bookings found.</div>;
  }
  return (
    <div className="max-w-3xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-green-800 mb-6">My Bookings</h2>
      <div className="space-y-6">
        {bookings.map((b, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <img src={b.listing.image} alt={b.listing.title} className="w-20 h-20 rounded object-cover" />
                <div>
                  <div className="font-semibold text-lg">{b.listing.title}</div>
                  <div className="text-gray-500 text-sm">{b.listing.location}</div>
                  <div className="text-xs text-gray-400">{format(new Date(b.startDate), 'PP')} → {format(new Date(b.endDate), 'PP')}</div>
                  <div className="text-gray-600 text-sm">Guests: {b.guests}</div>
                  <div className="mt-1 font-medium">Total: ₹{b.total}</div>
                </div>
              </div>
              <div className="flex space-x-4 mt-2">
                <span className={`text-sm px-3 py-1 rounded-full ${b.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-800'}`}>{b.status || 'Confirmed'}</span>
                {b.status !== 'Cancelled' && <button onClick={() => handleCancel(idx)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">Cancel</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
