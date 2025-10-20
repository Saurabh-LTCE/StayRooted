import React from 'react';
import { NavLink } from 'react-router-dom';
import { User, CalendarDays, LayoutDashboard } from 'lucide-react';

function TravelerSidebar() {
  return (
    <aside className="w-full md:w-64 bg-white border rounded md:sticky md:top-4 h-max">
      <nav className="p-4 space-y-1">
        <NavLink
          to="/traveler"
          end
          className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded hover:bg-green-50 ${isActive ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-700'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/traveler/bookings"
          className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded hover:bg-green-50 ${isActive ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-700'}`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>My Bookings</span>
        </NavLink>
        <NavLink
          to="/traveler/profile"
          className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded hover:bg-green-50 ${isActive ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-700'}`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </aside>
  );
}

export default TravelerSidebar;


