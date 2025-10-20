import React from 'react';
import { NavLink } from 'react-router-dom';

function DashboardSidebar({ role }) {
	const linksByRole = {
		host: [
			{ to: '/dashboard/host', label: 'Overview' },
		],
		traveler: [
			{ to: '/dashboard/traveler', label: 'Overview' },
			{ to: '/dashboard/traveler/bookings', label: 'My Bookings' },
			{ to: '/dashboard/traveler/profile', label: 'Profile' },
		],
		admin: [
			{ to: '/dashboard/admin', label: 'Admin' },
		],
	};
	const items = linksByRole[role] || linksByRole.traveler;

	return (
		<aside className="w-full md:w-64 bg-white border rounded md:sticky md:top-4 h-max">
			<nav className="p-4 space-y-1">
				{items.map(item => (
					<NavLink key={item.to} to={item.to} end className={({ isActive }) => `block px-3 py-2 rounded hover:bg-green-50 ${isActive ? 'bg-green-100 text-green-800 font-medium' : 'text-gray-700'}`}>
						{item.label}
					</NavLink>
				))}
			</nav>
		</aside>
	);
}

export default DashboardSidebar;
