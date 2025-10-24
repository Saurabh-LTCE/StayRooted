import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminListings() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-10">Manage Listings</h1>
        {/* Data Table Placeholder */}
        <div className="bg-white rounded shadow p-6 min-h-[200px]">(Listings table with approve/delete will appear here)</div>
      </main>
    </div>
  );
}
