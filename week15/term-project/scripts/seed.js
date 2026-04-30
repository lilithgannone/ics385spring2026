// scripts/seed.js

// Altered to be consistent with other files (const and require instead of import).
const mongoose = require("mongoose");
const Property = require("../models/Property");
require("dotenv").config();

// Seed the database with initial data while keeping the reviews and contact messages if the property already exists. 
async function seedDB() {
    await mongoose.connect(process.env.MONGO_URI);

    const lavaBirdsProperty = {
        name: 'Lava Birds B&B',
        island: 'Hawaii Island',
        type: 'vacation rental',
        description: 'Lava Birds Bed and Breakfast is an affordable, cozy getaway featuring rustic, romantic, and immersive suites, specilizing in personalized service for honeymooners.',
        logoURL: '/assets/logo.png',
        logoImageAlt: 'Lava Birds B&B logo',
        amenities: ['hot tub','themed suites','on-suite private outdoor space','coffee and tea tastings', 'short distance to volcano tours', 'cozy communal spaces', 'free parking', 'free wifi', 'optional upgrades and breakfast packages', 'fresh seasonal local fruit when avilable', 'daily housekeeping', 'library nook: local nature books and guides', 'lounge'],
        targetSegment: 'Honeymooners',
        tagline: 'A quiet, immersive stay near Kilauea, meant to be shared.',
        locationSummary: 'Located near Kilauea on Hawaii Island, with easy access to volcano views, scenic drives, and local experiences.',
        ownerName: 'Christina Chen',
        ownerImageURL: '/assets/owner.jpg',
        ownerImageAlt: 'Portrait of Christina Chen, owner of Lava Birds B&B',
        lavaVideoURL: 'https://www.youtube.com/embed/Umlf7-iBlKQ?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&playsinline=1&loop=1&playlist=Umlf7-iBlKQ&start=20&end=80',
        lavaVideoAlt: 'Video of lava flowing near Kilauea Volcano on Hawaii Island',
        ownerSummary: 'Christina was born in Hilo, Hawaii and always dreamed of opening up a bed and breakfast. After years of hard work in the hospitality industry, she opened Lava Birds B&B in the hopes of providing couples with meaningful experiences that leave them with a lifetime of memories. Christina manages Lava Birds B&B with a focus on affordable, romantic stays that feel personal and connected to the local environment.. Although Lava Birds specilizes in couples packages, she hopes that all travelers will enjoy time at Lava Birds B&B through access to cozy and comforting amenities at an affordable price.',
        imageURL: '/assets/lava.jpg',
        heroImageAlt: 'Exterior view of Lava Birds B&B near Kilauea on Hawaii Island',
        carouselImages: [
            {
                imageURL: '/assets/lava-1.jpg',
                imageAlt: 'Coffee and tea tasting setup at Lava Birds B&B'
            },
            {
                imageURL: '/assets/lava-2.jpg',
                imageAlt: 'Guest room at Lava Birds B&B'
            },
            {
                imageURL: '/assets/lava-3.jpg',
                imageAlt: 'Outdoor private on-suite seating area at Lava Birds B&B'
            },
            {
                imageURL: '/assets/lava-4.jpg',
                imageAlt: 'Garden view at Lava Birds B&B'
            },
            {
                imageURL: '/assets/lava-5.jpg',
                imageAlt: 'Scenic view near Lava Birds B&B'
            }
        ],
        contactEmail: 'reservations@lavabirdsbb.com',
        ctaText: 'Contact Us',
        specialOffer: 'Enjoy a honeymoon package that includes a welcome setup with local treats, a private volcano tour, and a picnic for two.',
        specialOfferDetails: 'Upgrade to our honeymoon package which includes a welcome setup with local treats, a private volcano tour, and a picnic for two for an affordable price. Contact us to learn more and book your romantic getaway near Kilauea Volcano.',
        specialImageURL: '/assets/special.jpg',
        specialImageAlt: 'Romantic picnic setup for two as part of the honeymoon package special offer at Lava Birds B&B'
    };

    const existingProperty = await Property.findOne({ name: "Lava Birds B&B" });

    if (existingProperty) {
        Object.assign(existingProperty, lavaBirdsProperty);

        await existingProperty.save();

        console.log("Seed complete - property updated, existing reviews and contact messages preserved.");
    } else {
        await Property.create({
            ...lavaBirdsProperty,
            reviews: [
                {
                    guestName: "Tom",
                    rating: 5,
                    comment: "So cozy, amazing stay!"
                },
                {
                    guestName: "Kai",
                    rating: 4.5,
                    comment: "Great location."
                }
            ],
            contactMessages: []
        });

        console.log("Seed complete - property created with starter reviews.");
    }

    await mongoose.disconnect();
}

seedDB();
