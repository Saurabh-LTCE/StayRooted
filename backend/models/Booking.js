const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  traveler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Traveler is required']
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
  checkIn: {
    type: Date,
    required: function() {
      return this.listing;
    },
    validate: {
      validator: function(date) {
        return !this.listing || date > new Date();
      },
      message: 'Check-in date must be in the future'
    }
  },
  checkOut: {
    type: Date,
    required: function() {
      return this.listing;
    },
    validate: {
      validator: function(date) {
        return !this.listing || date > this.checkIn;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  experienceDate: {
    type: Date,
    required: function() {
      return this.experience;
    },
    validate: {
      validator: function(date) {
        return !this.experience || date > new Date();
      },
      message: 'Experience date must be in the future'
    }
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'Number of guests must be at least 1']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot be more than 500 characters']
  },
  cancellationReason: {
    type: String,
    maxlength: [500, 'Cancellation reason cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Ensure either listing or experience is provided, but not both
bookingSchema.pre('validate', function(next) {
  if (!this.listing && !this.experience) {
    next(new Error('Either listing or experience must be provided'));
  } else if (this.listing && this.experience) {
    next(new Error('Cannot book both listing and experience in the same booking'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
