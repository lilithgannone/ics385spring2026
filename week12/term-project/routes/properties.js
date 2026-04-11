// manually coded
// import express and create a router
const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// GET /properties
// creates a route to get the property details
// moving away from multi-propert logic to a single property (findOne from fingMany)
router.get("/", async (req, res) => {
  const property = await Property.findOne({ name: "Lava Birds B&B" });
  if (!property) return res.status(404).send("Not found");
  res.render("properties", { property });
});

// POST /properties/reviews
// creates a route for review submission and ensures fields are filled. Some error handling. 
router.post("/reviews", async (req, res) => {
  const property = await Property.findOne({ name: "Lava Birds B&B" });
  if (!property) return res.status(404).send("Not found");

  if (!req.body.guestName || !req.body.rating) {
  return res.status(400).send("Missing required fields");
  }

  property.reviews.push(req.body);


  const total = property.reviews.reduce((sum, review) => sum + review.rating, 0);
  property.averageRating = total / property.reviews.length;

  // writes the updated document back to MongoDB: new reviews, avg. rating. 
  await property.save();
  res.status(201).json(property);
});

//makes the file usable for app.js
module.exports = router;