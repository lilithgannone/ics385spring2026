const mongoose = require("mongoose");

// Define the review schema. Manually coded. 
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


// Define the image schema for the carousel. 
const imageSchema = new mongoose.Schema({
    imageURL: {
        type: String,
        required: true
    },
    imageAlt: {
        type: String,
        default: ""
    }
}, { _id: false });


// Define the property schema. 
// Majority manual coded, some AI assitance for type info and required fields.
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

    logoURL: {
        type: String,
        default: ""
    },

    logoImageAlt: {
        type: String,
        default: ""
    },
    
    amenities: {
        type: [String], // Array of strings
        required: true
    },
    
    targetSegment: {
        type: String,
        default: "Honeymooners"
    },

    tagline: {
        type: String,
        default: ""
    },

    locationSummary: {
        type: String,
        default: ""
    },

    ownerName: {
        type: String,
        default: ""
    },

    ownerSummary: {
        type: String,
        default: ""
    },

    ownerImageURL: {
        type: String,
        default: ""
    },
    
    ownerImageAlt: {
        type: String,
        default: ""
    },

    lavaVideoURL: {
        type: String,
        default: ""
    },

    lavaVideoAlt: {
        type: String,
        default: ""
    },
    
    imageURL: {
        type: String,
        required: true
    },

    heroImageAlt: {
        type: String,
        default: ""
    },
    
    carouselImages: {
        type: [imageSchema],
        default: []
    },

    contactEmail: {
        type: String,
        default: ""
    },

    ctaText: {
        type: String,
        default: "Contact Us"
    },

    specialOffer: {
        type: String,
        default: ""
    },

    specialOfferDetails: {
        type: String,
        default: ""
    },

    specialImageURL: {
        type: String,
        default: ""
    },
    
    specialImageAlt: {
        type: String,
        default: ""
    },

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

// Needed to resolve a bug I encountered. 
// Creates and exports the Property model using the schema above. 
module.exports = mongoose.model("Property", propertySchema);
