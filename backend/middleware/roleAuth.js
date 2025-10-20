const { auth, authorize } = require('./auth');

// Always attach user via JWT
const requireAuth = auth;

// Role-specific gates
const requireHost = [auth, authorize('host', 'admin')];
const requireAdmin = [auth, authorize('admin')];
const requireTraveler = [auth, authorize('traveler', 'admin')];

module.exports = { requireAuth, requireHost, requireAdmin, requireTraveler };


