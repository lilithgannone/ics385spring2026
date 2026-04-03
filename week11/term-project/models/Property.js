const mongoose = require("mongoose");

// Define the review schema. Manually coded. 
// Assisted by ChatGPT for comment and date fields.
const reviewSchema = new mongoose.Schema({
    guestName: { 
        type: String, 
        required: true 
    },
    rating: {
        type: Number,
        min: 1, 
        max: 5,
        required: true
    },
    comment: {
        type: String
    },
    date: {
        type: Date, 
        default: Date.now 
    },

});

// Define the property schema. 
const propertySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    
    island: {
        type: String,
        required: true,
        enum: ['Maui','Oahu','Hawaii Island','Kauai','Molokai','Lanai']
    },
    
    type: {
        type: String,
        required: true,
        enum: ['hotel','vacation rental']
    },
    
    description: {
        type: String,
        maxlength: 500
    },
    
    amenities: [String], // Array of strings
    
    targetSegment: String,
    
    imageURL: String,

// Add the reviews field to the property schema. 
// AI assisted with this section, but I wrote the in code myself.
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
      reviews: [reviewSchema]

}, {
    timestamps: true // Adds createdAt / updatedAt automatically
}); 

// AI assisted with this section, but I wrote the code in myself. 
// Needed to resolve a bug I encountered. Creates and export the Property model using the schema above. 
module.exports = mongoose.model("Property", propertySchema);
