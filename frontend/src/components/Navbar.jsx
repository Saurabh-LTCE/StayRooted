import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [dropdown, setDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('sr_token');
  const role = localStorage.getItem('sr_role');

  const handleLogout = () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_role');
    setDropdown(false);
    setMobileMenu(false);
    navigate('/');
  };

  return (
    <nav className="bg-green-800 text-white shadow-md">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Logo + brand */}
        <Link to="/" className="flex items-center font-bold text-xl tracking-tight gap-2">
          <img src="/stayrooted-logo.svg" alt="StayRooted Logo" className="w-8 h-8 mr-1" />
          StayRooted
        </Link>
        <div className="flex items-center gap-3">
          {/* Navigation links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/listings" className="hover:underline">Listings</Link>
            <Link to="/discover" className="hover:underline">Discover</Link>
            <Link to="/experiences" className="hover:underline">Experiences</Link>
            {isLoggedIn && role === 'host' && <Link to="/dashboard/host" className="hover:underline">Host</Link>}
            {isLoggedIn && role !== 'host' && <Link to="/dashboard/traveler" className="hover:underline">Traveler</Link>}
          </div>
          {/* User dropdown or login/register */}
          <div className="relative hidden md:block">
            {isLoggedIn ? (
              <button
                className="flex items-center space-x-2 bg-green-200 text-green-900 font-semibold px-3 py-1 rounded shadow ring-2 ring-green-600 border border-green-500 hover:bg-green-300 transition-colors duration-150"
                onClick={() => setDropdown((d) => !d)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20c0-2.21 3.582-4 6-4s6 1.79 6 4"/></svg>
                <span>User</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
            ) : (
              <div className="space-x-2">
                <Link to="/role-selection" className="bg-white text-green-800 px-3 py-1 rounded hover:bg-green-100">Login</Link>
                <Link to="/role-selection" className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">Register</Link>
              </div>
            )}
            {dropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-green-900 rounded shadow-lg z-10">
                <Link to="/profile" className="block px-4 py-2 hover:bg-green-100" onClick={() => setDropdown(false)}>Profile</Link>
                <button className="block w-full text-left px-4 py-2 hover:bg-green-100" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
        {/* Mobile menu button */}
        <button className="md:hidden flex items-center" onClick={() => setMobileMenu(m => !m)}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden bg-green-900 px-4 pb-4 space-y-2">
          <Link to="/" className="block py-2" onClick={() => setMobileMenu(false)}>Home</Link>
          <Link to="/listings" className="block py-2" onClick={() => setMobileMenu(false)}>Listings</Link>
          <Link to="/discover" className="block py-2" onClick={() => setMobileMenu(false)}>Discover</Link>
          <Link to="/experiences" className="block py-2" onClick={() => setMobileMenu(false)}>Experiences</Link>
          {isLoggedIn && role === 'host' && (
            <Link to="/dashboard/host" className="block py-2" onClick={() => setMobileMenu(false)}>Host</Link>
          )}
          {isLoggedIn && role !== 'host' && (
            <Link to="/dashboard/traveler" className="block py-2" onClick={() => setMobileMenu(false)}>Traveler</Link>
          )}
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="block py-2" onClick={() => setMobileMenu(false)}>Profile</Link>
              <button className="block w-full text-left py-2" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/role-selection" className="block py-2" onClick={() => setMobileMenu(false)}>Login</Link>
              <Link to="/role-selection" className="block py-2" onClick={() => setMobileMenu(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
