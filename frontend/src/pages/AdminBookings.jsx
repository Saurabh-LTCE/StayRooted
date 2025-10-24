import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminBookings() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-10">View Bookings</h1>
        {/* Filters Placeholder */}
        <div className="flex gap-3 mb-6">
          <select className="border rounded px-3 py-1">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Cancelled</option>
          </select>
        </div>
        {/* Data Table Placeholder */}
        <div className="bg-white rounded shadow p-6 min-h-[200px]">(Bookings table will appear here)</div>
      </main>
    </div>
  );
}
