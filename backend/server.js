

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');


// Force load .env from specific path
dotenv.config({ path: path.join(__dirname, '.env') });

// Load environment variables
console.log('Loading .env file...');
const result = dotenv.config();

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
} else {
  console.log('✅ .env file loaded successfully');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import routes
const usersRoute = require('./routes/users');
const listingsRoute = require('./routes/listings');
const bookingsRoute = require('./routes/bookings');
const experiencesRoute = require('./routes/experiences');
const reviewsRoute = require('./routes/reviews');
const travelerDashboardRoute = require('./routes/travelerDashboard');
const hostRoutes = require('./routes/hostRoutes');

// Import error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Use routes
app.use('/api/users', usersRoute);
app.use('/api/listings', listingsRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/experiences', experiencesRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/dashboard/traveler', travelerDashboardRoute);
app.use('/api/host', hostRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Debug environment variables
console.log('Environment check:');
console.log('PORT:', PORT);
console.log('MONGO_URI exists:', !!MONGO_URI);
console.log('MONGO_URI length:', MONGO_URI ? MONGO_URI.length : 'undefined');

// Check if MONGO_URI is defined
if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables');
  console.error('Please create a .env file with your MongoDB connection string');
  console.error('Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'StayRooted API is running',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      listings: '/api/listings',
      bookings: '/api/bookings',
      experiences: '/api/experiences',
      reviews: '/api/reviews',
      travelerDashboard: '/api/dashboard/traveler'
      ,host: '/api/host'
    }
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}`);
});
