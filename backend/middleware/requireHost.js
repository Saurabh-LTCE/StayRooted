const { auth, authorize } = require('./auth');

// Compose auth + host/admin role check
const requireHost = [auth, authorize('host', 'admin')];

module.exports = requireHost;


