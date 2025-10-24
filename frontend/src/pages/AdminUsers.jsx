import React from 'react';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminUsers() {
  return (
    <div className="flex">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-10">Manage Users</h1>
        {/* Search & Filter Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input type="text" className="border rounded px-3 py-1" placeholder="Search by name or email..." />
          <select className="border rounded px-3 py-1">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Host</option>
            <option>Traveler</option>
          </select>
          <select className="border rounded px-3 py-1">
            <option>All Statuses</option>
            <option>Verified</option>
            <option>Blocked</option>
          </select>
        </div>
        {/* Data Table Placeholder */}
        <div className="bg-white rounded shadow p-6 min-h-[200px]">(User table will appear here)</div>
      </main>
    </div>
  );
}
