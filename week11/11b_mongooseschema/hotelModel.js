const mongoose = require('mongoose');

// Define the hotel schema
const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    location: { type: String, required: true },
    description: { type: String, required: true },
  // Add any other fields as needed
});

// Create the hotel model
const Hotel = mongoose.model('Hotel', hotelSchema);

module.exports = Hotel;