const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: function() {
      return !this.experience;
    }
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: function() {
      return !this.listing;
    }
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure either listing or experience is provided, but not both
reviewSchema.pre('validate', function(next) {
  if (!this.listing && !this.experience) {
    next(new Error('Either listing or experience must be provided'));
  } else if (this.listing && this.experience) {
    next(new Error('Cannot review both listing and experience in the same review'));
  } else {
    next();
  }
});

// Ensure one review per user per listing/experience
reviewSchema.index({ user: 1, listing: 1 }, { unique: true, partialFilterExpression: { listing: { $exists: true } } });
reviewSchema.index({ user: 1, experience: 1 }, { unique: true, partialFilterExpression: { experience: { $exists: true } } });

module.exports = mongoose.model('Review', reviewSchema);
