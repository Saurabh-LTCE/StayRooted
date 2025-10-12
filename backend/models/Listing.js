const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host is required']
  },
  amenities: [String],
  maxGuests: {
    type: Number,
    required: [true, 'Maximum guests is required'],
    min: [1, 'Maximum guests must be at least 1']
  },
  propertyType: {
    type: String,
    enum: ['house', 'apartment', 'room', 'villa', 'farmhouse'],
    required: [true, 'Property type is required']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
listingSchema.index({ 
  'location.city': 'text', 
  'location.state': 'text', 
  'location.country': 'text',
  title: 'text',
  description: 'text'
});

module.exports = mongoose.model('Listing', listingSchema);
