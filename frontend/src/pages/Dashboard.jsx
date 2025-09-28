import React from 'react';

const mockBookings = [
  { id: 1, title: 'Rustic Mountain Homestay', date: '2024-10-10', status: 'Confirmed' },
  { id: 2, title: 'Organic Farm Retreat', date: '2024-11-05', status: 'Pending' },
];

function Dashboard() {
  return (
    <div className="max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-green-800">Welcome to your Dashboard</h2>
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Your Bookings</h3>
        <ul className="divide-y">
          {mockBookings.map(b => (
            <li key={b.id} className="py-3 flex justify-between items-center">
              <span>{b.title}</span>
              <span className="text-green-700 font-medium">{b.date}</span>
              <span className={`px-2 py-1 rounded text-xs ${b.status === 'Confirmed' ? 'bg-green-200 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{b.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
