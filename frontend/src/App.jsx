import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import Discover from './pages/Discover';
import Experiences from './pages/Experiences';
import ListingDetail from './pages/ListingDetail';
import Dashboard from './pages/Dashboard';
import TravelerDashboard from './pages/TravelerDashboard';
import TravelerBookings from './pages/TravelerBookings';
import TravelerProfile from './pages/TravelerProfile';
import Profile from './pages/Profile';
import BookingConfirmation from './pages/BookingConfirmation';
import MyBookings from './pages/MyBookings';
import HostDashboard from './pages/HostDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddListing from './pages/AddListing';
import EditListing from './pages/EditListing';
import RoleSelection from './pages/RoleSelection';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminListings from './pages/AdminListings';
import AdminBookings from './pages/AdminBookings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/dashboard/host" element={<ProtectedRoute allowRoles={["host", "admin"]}><HostDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/traveler" element={<ProtectedRoute allowRoles={["traveler", "admin"]}><TravelerDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/traveler/bookings" element={<ProtectedRoute allowRoles={["traveler", "admin"]}><TravelerBookings /></ProtectedRoute>} />
            <Route path="/dashboard/traveler/profile" element={<ProtectedRoute allowRoles={["traveler", "admin"]}><TravelerProfile /></ProtectedRoute>} />
            {/* ADMIN DASHBOARD ROUTES */}
            <Route path="/dashboard/admin" element={<ProtectedRoute allowRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/dashboard/admin/users" element={<ProtectedRoute allowRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
            <Route path="/dashboard/admin/listings" element={<ProtectedRoute allowRoles={["admin"]}><AdminListings /></ProtectedRoute>} />
            <Route path="/dashboard/admin/bookings" element={<ProtectedRoute allowRoles={["admin"]}><AdminBookings /></ProtectedRoute>} />
            {/* Other routes */}
            <Route path="/listings" element={<Listings />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking/confirmation" element={<BookingConfirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/edit-listing/:id" element={<EditListing />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
