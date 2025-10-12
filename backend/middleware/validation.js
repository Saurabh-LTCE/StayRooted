const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User validation rules
const validateUser = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['traveler', 'host', 'admin'])
    .withMessage('Role must be traveler, host, or admin'),
  handleValidationErrors
];

// Listing validation rules
const validateListing = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('location.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('maxGuests')
    .isInt({ min: 1 })
    .withMessage('Maximum guests must be at least 1'),
  body('propertyType')
    .isIn(['house', 'apartment', 'room', 'villa', 'farmhouse'])
    .withMessage('Invalid property type'),
  handleValidationErrors
];

// Experience validation rules
const validateExperience = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Experience date must be in the future');
      }
      return true;
    }),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 hour'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('maxParticipants')
    .isInt({ min: 1 })
    .withMessage('Maximum participants must be at least 1'),
  body('category')
    .isIn(['cultural', 'adventure', 'culinary', 'nature', 'art', 'music', 'farming', 'craft'])
    .withMessage('Invalid category'),
  handleValidationErrors
];

// Booking validation rules
const validateBooking = [
  body('checkIn')
    .optional()
    .isISO8601()
    .withMessage('Check-in date must be a valid ISO 8601 date')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('Check-in date must be in the future');
      }
      return true;
    }),
  body('checkOut')
    .optional()
    .isISO8601()
    .withMessage('Check-out date must be a valid ISO 8601 date'),
  body('experienceDate')
    .optional()
    .isISO8601()
    .withMessage('Experience date must be a valid ISO 8601 date')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('Experience date must be in the future');
      }
      return true;
    }),
  body('guests')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
  body('totalPrice')
    .isNumeric()
    .withMessage('Total price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Total price must be a positive number'),
  body('status')
    .optional()
    .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
    .withMessage('Invalid status'),
  handleValidationErrors
];

// Review validation rules
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Comment is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUser,
  validateListing,
  validateExperience,
  validateBooking,
  validateReview
};
