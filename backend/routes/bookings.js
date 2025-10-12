const express = require('express');
const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const Experience = require('../models/Experience');
const { auth, authorize } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings (Admin only)
// @access  Private/Admin
router.get('/', auth, authorize('admin'), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('traveler', 'name email')
      .populate('listing', 'title location')
      .populate('experience', 'title location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get current user's bookings
// @access  Private
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ traveler: req.user._id })
      .populate('listing', 'title location price images')
      .populate('experience', 'title location price images date')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('traveler', 'name email phone')
      .populate('listing', 'title location price images host')
      .populate('experience', 'title location price images date host');

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    // Check if user owns the booking or is admin
    if (booking.traveler._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to view this booking' 
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private/Traveler
router.post('/', auth, authorize('traveler', 'admin'), validateBooking, async (req, res) => {
  try {
    const { listing, experience, checkIn, checkOut, experienceDate, guests, specialRequests } = req.body;

    // Validate that either listing or experience is provided, but not both
    if (!listing && !experience) {
      return res.status(400).json({
        success: false,
        error: 'Either listing or experience must be provided'
      });
    }

    if (listing && experience) {
      return res.status(400).json({
        success: false,
        error: 'Cannot book both listing and experience in the same booking'
      });
    }

    let resource;
    let totalPrice = 0;

    if (listing) {
      // Validate listing exists and is available
      resource = await Listing.findById(listing);
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Listing not found'
        });
      }

      if (!resource.isAvailable) {
        return res.status(400).json({
          success: false,
          error: 'Listing is not available'
        });
      }

      // Calculate total price based on nights
      const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
      totalPrice = resource.price * nights;
    }

    if (experience) {
      // Validate experience exists and is active
      resource = await Experience.findById(experience);
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Experience not found'
        });
      }

      if (!resource.isActive) {
        return res.status(400).json({
          success: false,
          error: 'Experience is not active'
        });
      }

      totalPrice = resource.price * guests;
    }

    // Create booking data
    const bookingData = {
      traveler: req.user._id,
      guests,
      totalPrice,
      specialRequests
    };

    if (listing) {
      bookingData.listing = listing;
      bookingData.checkIn = new Date(checkIn);
      bookingData.checkOut = new Date(checkOut);
    }

    if (experience) {
      bookingData.experience = experience;
      bookingData.experienceDate = new Date(experienceDate);
    }

    const booking = new Booking(bookingData);
    await booking.save();

    await booking.populate('traveler', 'name email');
    if (listing) {
      await booking.populate('listing', 'title location price images');
    }
    if (experience) {
      await booking.populate('experience', 'title location price images date');
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    // Check authorization
    const isTraveler = booking.traveler.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isHost = booking.listing ? 
      (await Listing.findById(booking.listing)).host.toString() === req.user._id.toString() :
      (await Experience.findById(booking.experience)).host.toString() === req.user._id.toString();

    if (!isTraveler && !isAdmin && !isHost) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this booking' 
      });
    }

    // Update booking
    const updateData = {};
    if (status) updateData.status = status;
    if (cancellationReason) updateData.cancellationReason = cancellationReason;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('traveler', 'name email')
     .populate('listing', 'title location')
     .populate('experience', 'title location');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    // Check if user owns the booking or is admin
    if (booking.traveler.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to cancel this booking' 
      });
    }

    // Update booking status to cancelled instead of deleting
    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/bookings/host/my-host-bookings
// @desc    Get bookings for host's listings/experiences
// @access  Private/Host
router.get('/host/my-host-bookings', auth, authorize('host', 'admin'), async (req, res) => {
  try {
    // Get host's listings and experiences
    const listings = await Listing.find({ host: req.user._id }).select('_id');
    const experiences = await Experience.find({ host: req.user._id }).select('_id');

    const listingIds = listings.map(l => l._id);
    const experienceIds = experiences.map(e => e._id);

    const bookings = await Booking.find({
      $or: [
        { listing: { $in: listingIds } },
        { experience: { $in: experienceIds } }
      ]
    })
    .populate('traveler', 'name email phone')
    .populate('listing', 'title location')
    .populate('experience', 'title location')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;
