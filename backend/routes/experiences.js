const express = require('express');
const Experience = require('../models/Experience');
const { auth, authorize } = require('../middleware/auth');
const { validateExperience } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/experiences
// @desc    Get all experiences with search and filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      city, 
      state, 
      country, 
      category,
      minPrice, 
      maxPrice,
      date,
      page = 1,
      limit = 10
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (state) filter['location.state'] = new RegExp(state, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');
    if (category) filter.category = category;

    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      filter.date = { $gte: targetDate, $lt: nextDay };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const experiences = await Experience.find(filter)
      .populate('host', 'name email avatar')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Experience.countDocuments(filter);

    res.json({
      success: true,
      count: experiences.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      experiences
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/experiences/:id
// @desc    Get single experience
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('host', 'name email avatar bio phone');

    if (!experience) {
      return res.status(404).json({ 
        success: false, 
        error: 'Experience not found' 
      });
    }

    res.json({
      success: true,
      experience
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   POST /api/experiences
// @desc    Create new experience
// @access  Private/Host
router.post('/', auth, authorize('host', 'admin'), validateExperience, async (req, res) => {
  try {
    const experienceData = {
      ...req.body,
      host: req.user._id
    };

    const experience = new Experience(experienceData);
    await experience.save();

    await experience.populate('host', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      experience
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   PUT /api/experiences/:id
// @desc    Update experience
// @access  Private/Host or Admin
router.put('/:id', auth, validateExperience, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ 
        success: false, 
        error: 'Experience not found' 
      });
    }

    // Check if user owns the experience or is admin
    if (experience.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this experience' 
      });
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name email avatar');

    res.json({
      success: true,
      message: 'Experience updated successfully',
      experience: updatedExperience
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   DELETE /api/experiences/:id
// @desc    Delete experience
// @access  Private/Host or Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({ 
        success: false, 
        error: 'Experience not found' 
      });
    }

    // Check if user owns the experience or is admin
    if (experience.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to delete this experience' 
      });
    }

    await Experience.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/experiences/host/my-experiences
// @desc    Get current host's experiences
// @access  Private/Host
router.get('/host/my-experiences', auth, authorize('host', 'admin'), async (req, res) => {
  try {
    const experiences = await Experience.find({ host: req.user._id })
      .populate('host', 'name email avatar')
      .sort({ date: 1 });

    res.json({
      success: true,
      count: experiences.length,
      experiences
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

module.exports = router;
