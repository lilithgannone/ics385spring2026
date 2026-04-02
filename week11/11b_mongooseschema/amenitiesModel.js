const mongoose = require('mongoose');

// Define the amenities schema
const amenitiesSchema = new mongoose.Schema({
  pool: { type: Boolean, required: true },
  lawn: { type: Boolean, required: true },
  BBQ: { type: Boolean, required: true },
  laundry: { type: Boolean, required: true },
  // Add any other fields as needed
});

// Create the amenities model
const Amenities = mongoose.model('Amenities', amenitiesSchema);

module.exports = Amenities;