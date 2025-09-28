const express = require('express');
const { body, validationResult } = require('express-validator');
const Experience = require('../models/Experience');
const router = express.Router();

// @route   GET /api/experiences
// @desc    Get all experiences
// @access  Public
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find().populate('host', 'name email');
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/experiences
// @desc    Create a new experience
// @access  Public
router.post(
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('date').notEmpty().withMessage('Date is required'),
    body('host').notEmpty().withMessage('Host is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const experience = new Experience(req.body);
      await experience.save();
      res.status(201).json({ message: 'Experience created', experience });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   GET /api/experiences/:id
// @desc    Get experience by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id).populate('host', 'name email');
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json(experience);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/experiences/:id
// @desc    Update experience by ID
// @access  Public
router.put(
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('date').optional().notEmpty().withMessage('Date cannot be empty')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const experience = await Experience.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      res.json(experience);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   DELETE /api/experiences/:id
// @desc    Delete experience by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return res.status(404).json({ error: 'Experience not found' });
    res.json({ message: 'Experience deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
