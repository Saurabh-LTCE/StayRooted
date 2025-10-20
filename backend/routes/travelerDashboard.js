const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { requireTraveler } = require('../middleware/roleAuth');

const router = express.Router();

// @route   GET /api/dashboard/traveler/bookings
// @desc    Get traveler bookings split by status/time and basic stats
// @access  Private/Traveler
router.get('/bookings', ...requireTraveler, async (req, res) => {
  try {
    const now = new Date();

    const travelerId = req.user._id;

    const bookings = await Booking.find({ traveler: travelerId })
      .populate('listing', 'title location images price')
      .populate('experience', 'title location images price date')
      .sort({ createdAt: -1 });

    const upcoming = [];
    const past = [];
    const cancelled = [];

    for (const booking of bookings) {
      if (booking.status === 'cancelled') {
        cancelled.push(booking);
        continue;
      }

      // Determine reference date for upcoming/past
      const referenceDate = booking.listing
        ? (booking.checkIn || booking.checkOut)
        : booking.experienceDate;

      if (referenceDate && referenceDate >= now) {
        upcoming.push(booking);
      } else {
        past.push(booking);
      }
    }

    res.json({
      success: true,
      stats: {
        totalTrips: bookings.filter(b => b.status !== 'cancelled').length,
        upcomingCount: upcoming.length,
        pastCount: past.length,
        cancelledCount: cancelled.length
      },
      upcoming,
      past,
      cancelled
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   GET /api/dashboard/traveler/profile
// @desc    Get current traveler profile
// @access  Private/Traveler
router.get('/profile', ...requireTraveler, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PUT /api/dashboard/traveler/profile
// @desc    Update current traveler profile
// @access  Private/Traveler
router.put('/profile', ...requireTraveler, async (req, res) => {
  try {
    const { name, bio, phone, avatar } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;


