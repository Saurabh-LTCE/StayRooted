const express = require('express');
const Review = require('../models/Review');
const Listing = require('../models/Listing');
const Experience = require('../models/Experience');
const { auth } = require('../middleware/auth');
const { validateReview } = require('../middleware/validation');
const router = express.Router();

// @route   GET /api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { listing, experience, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (listing) filter.listing = listing;
    if (experience) filter.experience = experience;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .populate('listing', 'title')
      .populate('experience', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      count: reviews.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      reviews
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar')
      .populate('listing', 'title')
      .populate('experience', 'title');

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }

    res.json({
      success: true,
      review
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', auth, validateReview, async (req, res) => {
  try {
    const { listing, experience, rating, comment } = req.body;

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
        error: 'Cannot review both listing and experience in the same review'
      });
    }

    // Check if user has already reviewed this resource
    const existingReview = await Review.findOne({
      user: req.user._id,
      ...(listing ? { listing } : { experience })
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'You have already reviewed this resource'
      });
    }

    // Verify the resource exists
    let resource;
    if (listing) {
      resource = await Listing.findById(listing);
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Listing not found'
        });
      }
    }

    if (experience) {
      resource = await Experience.findById(experience);
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Experience not found'
        });
      }
    }

    // Create review
    const reviewData = {
      user: req.user._id,
      rating,
      comment
    };

    if (listing) reviewData.listing = listing;
    if (experience) reviewData.experience = experience;

    const review = new Review(reviewData);
    await review.save();

    await review.populate('user', 'name avatar');
    if (listing) {
      await review.populate('listing', 'title');
    }
    if (experience) {
      await review.populate('experience', 'title');
    }

    // Update resource rating
    await updateResourceRating(listing || experience, listing ? 'listing' : 'experience');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', auth, validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to update this review' 
      });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, comment },
      { new: true, runValidators: true }
    ).populate('user', 'name avatar')
     .populate('listing', 'title')
     .populate('experience', 'title');

    // Update resource rating
    const resourceId = review.listing || review.experience;
    const resourceType = review.listing ? 'listing' : 'experience';
    await updateResourceRating(resourceId, resourceType);

    res.json({
      success: true,
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ 
        success: false, 
        error: 'Review not found' 
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not authorized to delete this review' 
      });
    }

    const resourceId = review.listing || review.experience;
    const resourceType = review.listing ? 'listing' : 'experience';

    await Review.findByIdAndDelete(req.params.id);

    // Update resource rating
    await updateResourceRating(resourceId, resourceType);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Helper function to update resource rating
async function updateResourceRating(resourceId, resourceType) {
  try {
    const reviews = await Review.find({ [resourceType]: resourceId });
    
    if (reviews.length === 0) {
      // No reviews, set default rating
      const updateData = {
        'rating.average': 0,
        'rating.count': 0
      };

      if (resourceType === 'listing') {
        await Listing.findByIdAndUpdate(resourceId, updateData);
      } else {
        await Experience.findByIdAndUpdate(resourceId, updateData);
      }
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    const updateData = {
      'rating.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      'rating.count': reviews.length
    };

    if (resourceType === 'listing') {
      await Listing.findByIdAndUpdate(resourceId, updateData);
    } else {
      await Experience.findByIdAndUpdate(resourceId, updateData);
    }
  } catch (error) {
    console.error('Error updating resource rating:', error);
  }
}

module.exports = router;
