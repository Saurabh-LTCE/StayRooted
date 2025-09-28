const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().populate('user listing');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Public
router.post(
  [
    body('user').notEmpty().withMessage('User is required'),
    body('listing').notEmpty().withMessage('Listing is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const review = new Review(req.body);
      await review.save();
      res.status(201).json({ message: 'Review created', review });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate('user listing');
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review by ID
// @access  Public
router.put(
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const review = await Review.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!review) return res.status(404).json({ error: 'Review not found' });
      res.json(review);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/reviews/:id
// @desc    Delete review by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
