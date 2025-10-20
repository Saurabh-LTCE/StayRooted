const express = require('express');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const { requireHost } = require('../middleware/roleAuth');

const router = express.Router();

// GET /api/host/dashboard → totals for listings, bookings, earnings
router.get('/dashboard', ...requireHost, async (req, res) => {
  try {
    const hostId = req.user._id;

    const [listings, experiences] = await Promise.all([
      Listing.find({ host: hostId }).select('_id price'),
      // If experiences model exists and hosts have experiences, include them; otherwise ignore
      Promise.resolve([])
    ]);

    const listingIds = listings.map(l => l._id);

    const bookings = await Booking.find({
      $or: [
        { listing: { $in: listingIds } },
        // { experience: { $in: experienceIds } }, // future extension
      ]
    }).select('status totalPrice');

    const totalListings = listings.length; // + experiences.length when enabled
    const totalBookings = bookings.length;
    const earnings = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    res.json({ success: true, totals: { listings: totalListings, bookings: totalBookings, earnings } });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/host/bookings → all host bookings populated
router.get('/bookings', ...requireHost, async (req, res) => {
  try {
    const hostId = req.user._id;
    const listings = await Listing.find({ host: hostId }).select('_id');
    const listingIds = listings.map(l => l._id);
    const bookings = await Booking.find({ listing: { $in: listingIds } })
      .populate('traveler', 'name email')
      .populate('listing', 'title location images');
    res.json({ success: true, bookings });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/host/bookings/:id/status → approve/decline booking
router.put('/bookings/:id/status', ...requireHost, async (req, res) => {
  try {
    const hostId = req.user._id;
    const { status } = req.body; // expected 'confirmed' or 'cancelled'
    if (!['confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id).populate('listing', 'host');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    if (!booking.listing || booking.listing.host.toString() !== hostId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized for this booking' });
    }

    booking.status = status;
    await booking.save();
    const updated = await Booking.findById(booking._id)
      .populate('traveler', 'name email')
      .populate('listing', 'title location');

    res.json({ success: true, message: 'Booking status updated', booking: updated });
  } catch (e) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;


