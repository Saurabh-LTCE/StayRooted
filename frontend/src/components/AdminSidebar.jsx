import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/listings', label: 'Listings' },
  { to: '/admin/bookings', label: 'Bookings' },
];

export default function AdminSidebar() {
  const location = useLocation();
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col py-4 px-2 fixed">
      <h2 className="text-2xl font-bold mb-8 text-center tracking-wide">Admin Panel</h2>
      <nav className="flex-1">
        <ul className="space-y-3">
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`block px-4 py-2 rounded transition-colors duration-200 hover:bg-gray-800 ${location.pathname === link.to ? 'bg-gray-800 font-semibold' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
