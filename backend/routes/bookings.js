const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const router = express.Router();

// @route   GET /api/bookings
// @desc    Get all bookings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('traveler listing');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Public
router.post(
  [
    body('traveler').notEmpty().withMessage('Traveler is required'),
    body('listing').notEmpty().withMessage('Listing is required'),
    body('dates').isArray({ min: 1 }).withMessage('Dates must be an array with at least one date'),
    body('guests').isNumeric().withMessage('Guests must be a number'),
    body('totalPrice').isNumeric().withMessage('Total price must be a number'),
    body('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Status must be pending, confirmed, or cancelled')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const booking = new Booking(req.body);
      await booking.save();
      res.status(201).json({ message: 'Booking created', booking });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('traveler listing');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking by ID
// @access  Public
router.put(
  [
    body('dates').optional().isArray({ min: 1 }).withMessage('Dates must be an array with at least one date'),
    body('guests').optional().isNumeric().withMessage('Guests must be a number'),
    body('totalPrice').optional().isNumeric().withMessage('Total price must be a number'),
    body('status').optional().isIn(['pending', 'confirmed', 'cancelled']).withMessage('Status must be pending, confirmed, or cancelled')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      res.json(booking);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/bookings/:id
// @desc    Delete booking by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
