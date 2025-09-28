const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  type: { type: String, enum: ['Homestay', 'Farm', 'Village', 'Bungalow'], default: 'Homestay' },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Listing', ListingSchema);
