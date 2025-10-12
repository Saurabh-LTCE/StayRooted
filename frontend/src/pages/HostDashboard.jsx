import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';

const MOCK_HOST_ID = 'replace-with-your-host-objectid';

// For simplicity, just mock fetch bookings/listings for demo; swap out for API calls
function fetchBookings() {
  return fetch('/api/bookings')
    .then(r => r.json())
    .catch(() => []);
}
function fetchListings() {
  return fetch('/api/listings')
    .then(r => r.json())
    .catch(() => []);
}

function getMockListings() {
  return [
    {
      _id: 'listing123',
      title: 'Rustic Mountain Homestay',
      location: 'Manali, Himachal Pradesh',
      price: 1200,
      host: { _id: MOCK_HOST_ID, name: 'Host A' },
      images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"],
    }
  ];
}
function getMockBookings() {
  const now = new Date();
  return [
    {
      _id: 'booking1',
      traveler: { name: 'Rahul Verma', email: 'rahul@email.com' },
      listing: getMockListings()[0],
      dates: [now.toISOString(), new Date(now.valueOf()+2*86400000).toISOString()],
      status: 'pending',
      totalPrice: 4800,
      guests: 4,
    },
    {
      _id: 'booking2',
      traveler: { name: 'Neha Singh', email: 'neha@email.com' },
      listing: getMockListings()[0],
      dates: [now.toISOString(), new Date(now.valueOf()+1*86400000).toISOString()],
      status: 'confirmed',
      totalPrice: 1200,
      guests: 2,
    }
  ];
}

function HostDashboard() {
  const [bookings, setBookings] = useState([]);
  const [listings, setListings] = useState([]);
  const [pending, setPending] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [calendar, setCalendar] = useState([]);
  const [refresh, setRefresh] = useState(0);

  // --- Pricing and Availability Block Management ---
  const [editing, setEditing] = useState(null);
  const [priceEdit, setPriceEdit] = useState('');
  const [blockedDates, setBlockedDates] = useState({}); // { [listingId]: [yyyy-mm-dd, ...] }

  const handlePriceEdit = (listing) => {
    setEditing(listing._id);
    setPriceEdit(listing.price);
  };
  const savePrice = async (id) => {
    await fetch(`/api/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: parseFloat(priceEdit) })
    });
    setEditing(null);
    window.location.reload();
  };
  const handleBlockDate = (id, date) => {
    setBlockedDates((prev) => ({ ...prev, [id]: [...(prev[id]||[]), date] }));
  };
  const handleUnblockDate = (id, date) => {
    setBlockedDates((prev) => ({ ...prev, [id]: (prev[id]||[]).filter(d => d !== date) }));
  };

  // Filter bookings for this host
  useEffect(() => {
    async function load() {
      let data = await fetchBookings();
      let allListings = await fetchListings();
      // Use only real backend API data; if empty, dashboard will show zero state for now.
      setListings(allListings.filter(l => l.host && l.host._id === MOCK_HOST_ID));
      // Host's bookings only
      const hostListingIds = allListings.filter(l => l.host && l.host._id === MOCK_HOST_ID).map(l => l._id);
      const these = data.filter(b => b.listing && hostListingIds.includes(b.listing._id));
      setBookings(these);
      setPending(these.filter(b => b.status === 'pending'));
      setEarnings(these.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + (b.totalPrice || 0), 0));
      const today = new Date();
      const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });
      setCalendar(days.map(day => ({
        date: day,
        bookings: these.filter(b => b.status === 'confirmed' && b.dates && b.dates.some(dateStr => isSameDay(parseISO(dateStr), day)) )
      })));
    }
    load();
  }, [refresh]);

  const handleStatus = async (bookingId, newStatus) => {
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setRefresh(r => r + 1);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-green-800 mb-8">Host Dashboard</h2>
      {/* Earnings Summary */}
      <div className="mb-10">
        <div className="p-6 rounded-lg shadow bg-white flex flex-col items-center">
          <div className="text-lg text-gray-600 mb-1">Total Earnings (Confirmed):</div>
          <div className="text-3xl font-bold text-green-700">₹{earnings}</div>
        </div>
      </div>
      {/* Calendar */}
      <div className="mb-10">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-xl font-semibold mb-3">Booking Calendar (This Month)</h3>
          <div className="flex flex-wrap gap-2">
            {calendar.map(day => (
              <div key={day.date}
                className={`w-16 h-16 border rounded flex flex-col items-center justify-center ${day.bookings.length ? 'bg-green-100 border-green-400' : 'bg-gray-50'}`}
              >
                <span className="font-bold">{format(day.date, 'dd')}</span>
                {day.bookings.length > 0 && (
                  <span className="text-xs text-green-700">{day.bookings.length} booked</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* --- Listing management --- */}
      <div className="mb-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Your Listings (Pricing &amp; Availability)</h3>
          <div className="space-y-6">
            {listings.map(listing => (
              <div key={listing._id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-semibold text-lg">{listing.title}</div>
                    <div className="text-gray-500 text-sm">{listing.location}</div>
                  </div>
                  <div>
                    {editing === listing._id ? (
                      <><input value={priceEdit} type="number" min="0" onChange={e=>setPriceEdit(e.target.value)} className="border px-2 py-1 rounded w-24 mr-2" /><button onClick={()=>savePrice(listing._id)} className="bg-green-700 text-white px-3 py-1 rounded">Save</button></>
                    ) : (
                      <><span className="font-bold text-green-700">₹{listing.price}</span> <button onClick={()=>handlePriceEdit(listing)} className="ml-2 px-3 py-1 bg-gray-200 rounded hover:bg-green-100">Edit Price</button></>
                    )}
                  </div>
                  <a href={`/edit-listing/${listing._id}`} className="ml-6 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit Listing</a>
                </div>
                <div className="mt-3">
                  <label className="block font-medium mb-1">Blocked Dates:</label>
                  <div className="flex flex-wrap gap-2">
                    {(blockedDates[listing._id]||[]).map(date => (
                      <span key={date} className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">{date}<button onClick={()=>handleUnblockDate(listing._id,date)} className="ml-1 text-xs">×</button></span>
                    ))}
                  </div>
                  <input 
                    type="date"
                    className="border px-2 py-1 rounded mt-2"
                    onChange={e=>handleBlockDate(listing._id,e.target.value)}
                  />
                </div>
              </div>
            ))}
            {listings.length === 0 && <div className="text-gray-500">No listings found.</div>}
          </div>
        </div>
      </div>
      {/* Request Table */}
      <div className="mb-10">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Booking Requests</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th>Date</th>
                <th>Guest</th>
                <th>Listing</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(r => (
                <tr key={r._id} className="border-b">
                  <td>{r.dates && r.dates.length ? `${format(parseISO(r.dates[0]),'PP')}${r.dates[1] ? ' → ' + format(parseISO(r.dates[1]),'PP') : ''}` : '-'}</td>
                  <td>{r.traveler && r.traveler.name || 'Unknown'}</td>
                  <td>{r.listing && r.listing.title || ''}</td>
                  <td>₹{r.totalPrice}</td>
                  <td className="capitalize">{r.status}</td>
                  <td className="space-x-2">
                    <button onClick={()=>handleStatus(r._id,'confirmed')} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Accept</button>
                    <button onClick={()=>handleStatus(r._id,'cancelled')} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Decline</button>
                  </td>
                </tr>
              ))}
              {pending.length===0 && <tr><td colSpan="6" className="py-4 text-center text-gray-500">No pending requests</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HostDashboard;
