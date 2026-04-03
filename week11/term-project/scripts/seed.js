// scripts/seed.js

// Altered to be consistent with other files (const and require instead of import). 
// AI assisted with this section to understand the need for consistency, manual insertion.
const mongoose = require("mongoose");
const Property = require("../models/Property");
require("dotenv").config();

async function seedDB() {
    await mongoose.connect(process.env.MONGO_URI);
    // Clear existing records
    await Property.deleteMany({}); 
    await Property.insertMany([
        {
            name: 'Lava Birds B&B', 
            island: 'Hawaii Island', 
            type: 'vacation rental',
            description: 'affordable, cozy getaway near Kilauea Volcano with themed suites and personalized service for honeymooners.',
            amenities: ['hot tub','themed suites','on-suite private outdoor space','coffee and tea tastings', 'short distance to volcano tours'],
            targetSegment: 'Honeymoon', 
            imageURL: '/images/lava.jpg',
            averageRating: 4.5,
            reviews: [
                {
                    guestName: "Tom",
                    rating: 5,
                    comment: "So cozy, amazing stay!"
                },
                {
                    guestName: "Kai",
                    rating: 4,
                    comment: "Great location."
                }
            ],
        },
        
        { 
            name: 'Grand Hyatt Kauai',
            island: 'Kauai',
            type: 'hotel',
            description: 'luxury resort with ocean views, multiple pools, spa, and fine dining, ideal for families and repeat visitors.',
            amenities: ['spa','golf','beach','restaurant'],
            targetSegment: 'Family',
            imageURL: '/images/kauai.jpg',
            averageRating: 4.5,
            reviews: [
                {
                    guestName: "Kim",
                    rating: 4,
                    comment: "Awesome!"
                },
                {
                    guestName: "John",
                    rating: 5,
                    comment: "Amazing amenities."
                }
            ],
        },
        
        { 
            name: 'Volcano House', 
            island: 'Hawaii Island', 
            type: 'hotel',
            description: 'cozy hotel with volcano views, local cuisine, and guided tours for eco-conscious travelers.',
            amenities: ['volcano view','restaurant','guided tours'],
            targetSegment: 'Eco-tourist',
            imageURL: '/images/volcano.jpg',
            averageRating: 4.0,
            reviews: [
                {
                    guestName: "Jack",
                    rating: 3,
                    comment: "Good, but could be better."
                },
                {
                    guestName: "Nalu",
                    rating: 5,
                    comment: "Great local cuisine."
                }
            ],
        },
        
        { 
            name: 'Surfer Shack HNL', 
            island: 'Oahu', 
            type: 'vacation rental',
            description: 'affordable vacation rental with surfboard rental, wifi, and kitchen for adventure seekers.',
            amenities: ['surfboard rental','wifi','kitchen'],
            targetSegment: 'Adventure seekers', 
            imageURL: '/images/hnl.jpg',
            averageRating: 4.0,
            reviews: [
                {
                    guestName: "Adan",
                    rating: 5,
                    comment: "Awesome!"
                },
                {
                    guestName: "John",
                    rating: 3,
                    comment: "Okay, wish the kitchen was bigger."
                }
            ],
        },
        
        { 
            name: 'Lanai Cat Refuge B&B', 
            island: 'Lanai', 
            type: 'vacation rental',
            description: 'cozy vacation rental with a cat sanctuary, garden, and peaceful atmosphere.',
            amenities: ['quiet','garden','cat sanctuary'],
            targetSegment: 'Repeat visitors', 
            imageURL: '/images/lanai.jpg',
            averageRating: 4.5,
            reviews: [
                {
                    guestName: "Kim",
                    rating: 4,
                    comment: "Awesome!"
                },
                {
                    guestName: "John",
                    rating: 5,
                    comment: "Amazing experience. Loved the cat sanctuary."
                }
            ],
        },

    ]);
    console.log('Seed complete — 5 properties inserted.');
    await mongoose.disconnect();
}

seedDB();
