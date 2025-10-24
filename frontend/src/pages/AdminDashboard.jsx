import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminDashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-10">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <span className="text-xl font-medium mb-2">Total Users</span>
            <span className="text-2xl font-bold text-blue-600">--</span>
          </div>
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <span className="text-xl font-medium mb-2">Total Listings</span>
            <span className="text-2xl font-bold text-green-600">--</span>
          </div>
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <span className="text-xl font-medium mb-2">Total Bookings</span>
            <span className="text-2xl font-bold text-purple-600">--</span>
          </div>
          <div className="bg-white shadow rounded p-6 flex flex-col items-center">
            <span className="text-xl font-medium mb-2">Total Revenue</span>
            <span className="text-2xl font-bold text-gray-600">$ --</span>
          </div>
        </div>
        {/* Recent Activity Placeholder */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-white shadow rounded p-6 min-h-[120px] text-gray-500">(Recent activity will appear here)</div>
        </section>
      </main>
    </div>
  );
}
