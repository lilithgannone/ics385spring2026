// scripts/seed.js
import mongoose from 'mongoose';
import Property from '../models/Property.js';
import 'dotenv/config';

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
        imageURL: '/images/lava.jpg'
    },
    
    { 
        name: 'Grand Hyatt Kauai',
        island: 'Kauai',
        type: 'hotel',
        description: 'luxury resort with ocean views, multiple pools, spa, and fine dining, ideal for families and repeat visitors.',
        amenities: ['spa','golf','beach','restaurant'],
        targetSegment: 'Family',
        imageURL: '/images/kauai.jpg' 
    },
    
    { 
        name: 'Volcano House', 
        island: 'Hawaii Island', 
        type: 'hotel',
        description: 'cozy hotel with volcano views, local cuisine, and guided tours for eco-conscious travelers.',
        amenities: ['volcano view','restaurant','guided tours'],
        targetSegment: 'Eco-tourist',
        imageURL: '/images/volcano.jpg' 
    },
    
    { 
        name: 'Surfer Shack HNL', 
        island: 'Oahu', 
        type: 'vacation rental',
        description: 'affordable vacation rental with surfboard rental, wifi, and kitchen for adventure seekers.',
        amenities: ['surfboard rental','wifi','kitchen'],
        targetSegment: 'Adventure seekers', 
        imageURL: '/images/hnl.jpg' 
    },
    
    { 
        name: 'Lanai Cat Refuge B&B;', 
        island: 'Lanai', 
        type: 'vacation rental',
        description: 'cozy vacation rental with a cat sanctuary, garden, and peaceful atmosphere.',
        amenities: ['quiet','garden','cat sanctuary'],
        targetSegment: 'Repeat visitors', 
        imageURL: '/images/lanai.jpg' 
    },

]);
console.log('Seed complete — 5 properties inserted.');
await mongoose.disconnect();
