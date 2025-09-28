const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const usersRoute = require('./routes/users');
const listingsRoute = require('./routes/listings');
const bookingsRoute = require('./routes/bookings');
const experiencesRoute = require('./routes/experiences');
const reviewsRoute = require('./routes/reviews');

// Import error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Use routes
app.use('/api/users', usersRoute);
app.use('/api/listings', listingsRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/experiences', experiencesRoute);
app.use('/api/reviews', reviewsRoute);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Root endpoint
app.get('/', (req, res) => {
  res.send('StayRooted API is running');
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
