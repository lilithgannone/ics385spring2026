import mongoose from 'mongoose';

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

}, {
    timestamps: true // Adds createdAt / updatedAt automatically
}); 

export default mongoose.model('Property', propertySchema);
