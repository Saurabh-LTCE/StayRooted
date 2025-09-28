const express = require('express');
const { body, validationResult } = require('express-validator');
const Listing = require('../models/Listing');
const router = express.Router();

// @route   GET /api/listings
// @desc    Get all listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().populate('host', 'name email');
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/listings
// @desc    Create a new listing
// @access  Public
router.post(
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('host').notEmpty().withMessage('Host is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const listing = new Listing(req.body);
      await listing.save();
      res.status(201).json({ message: 'Listing created', listing });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   GET /api/listings/:id
// @desc    Get listing by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('host', 'name email');
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing by ID
// @access  Public
router.put(
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('location').optional().notEmpty().withMessage('Location cannot be empty'),
    body('price').optional().isNumeric().withMessage('Price must be a number')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!listing) return res.status(404).json({ error: 'Listing not found' });
      res.json(listing);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/listings/:id
// @desc    Delete listing by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
