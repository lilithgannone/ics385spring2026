// manually coded
// import express and create a router
const express = require("express");
const router = express.Router();
const Property = require("../models/Property");
// express validator used on user input in POST routes
const { body, validationResult } = require("express-validator");

function containsLink(text) {
  return /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|io|co|edu))/i.test(text);
}

const reviewValidation = [
  body("guestName").trim().isLength({ min: 1, max: 80 }).escape(),
  body("rating").isFloat({ min: 1, max: 5 }).toFloat(),
  body("comment").optional({ checkFalsy: true }).trim().isLength({ max: 1000 }).escape()
];

const contactValidation = [
  body("name").trim().isLength({ min: 1, max: 80 }).escape(),
  body("email").isEmail().normalizeEmail(),
  body("message").trim().isLength({ min: 1, max: 1000 }).escape()
];


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
router.post("/reviews", reviewValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send("Invalid review input");
  }

  try {
    const property = await Property.findOne({ name: "Lava Birds B&B" });
    if (!property) return res.status(404).send("Not found");

    const guestName = String(req.body.guestName || "").trim();
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();

    if (!guestName || Number.isNaN(rating)) {
      return res.status(400).send("Missing required fields");
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).send("Rating must be between 1 and 5");
    }

    if (containsLink(guestName) || containsLink(comment)) {
      return res.status(400).send("Links are not allowed in reviews");
    }

    property.reviews.push({
      guestName,
      rating,
      comment
    });

    const total = property.reviews.reduce((sum, review) => {
      return sum + Number(review.rating || 0);
    }, 0);

    property.averageRating = property.reviews.length
      ? total / property.reviews.length
      : 0;

  // writes the updated document back to MongoDB: new reviews, avg. rating. 
    await property.save();
    res.status(201).json(property);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// POST /properties/contact
router.post("/contact", contactValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Invalid contact input" });
  }
  try {
    const property = await Property.findOne({ name: "Lava Birds B&B" });
    if (!property) return res.status(404).json({ error: "Property not found" });

    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const message = String(req.body.message || "").trim();

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    property.contactMessages.push({
      name,
      email,
      message
    });

    await property.save();

    res.status(201).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;