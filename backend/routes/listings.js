const express = require('express');
const Listing = require('../models/Listing');
const { auth, authorize } = require('../middleware/auth');
const { validateListing } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/listings
// @desc    Get all listings with search and filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      city, 
      state, 
      country, 
      minPrice, 
      maxPrice, 
      propertyType, 
      maxGuests,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isAvailable: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');
    if (propertyType) filter.propertyType = propertyType;
    if (maxGuests) filter.maxGuests = { $gte: parseInt(maxGuests) };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await Listing.find(filter)
      .populate('host', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Listing.countDocuments(filter);

    res.json({
      success: true,
      count: listings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      listings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name email avatar bio phone');

    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }

    res.json({
      success: true,
      listing
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private/Host
router.post('/', auth, authorize('host', 'admin'), validateListing, async (req, res) => {
  try {
    const listingData = {
      ...req.body,
      host: req.user._id
    };

    const listing = new Listing(listingData);
    await listing.save();

    await listing.populate('host', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private/Host or Admin
router.put('/:id', auth, validateListing, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }

    // Check if user owns the listing or is admin
    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this listing' 
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name email avatar');

    res.json({
      success: true,
      message: 'Listing updated successfully',
      listing: updatedListing
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   DELETE /api/listings/:id
// @desc    Delete listing
// @access  Private/Host or Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ 
        success: false, 
        error: 'Listing not found' 
      });
    }

    // Check if user owns the listing or is admin
    if (listing.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to delete this listing' 
      });
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/listings/host/my-listings
// @desc    Get current host's listings
// @access  Private/Host
router.get('/host/my-listings', auth, authorize('host', 'admin'), async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user._id })
      .populate('host', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;
