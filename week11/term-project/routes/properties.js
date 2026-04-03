const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// GET/properties 
// AI assisted with this section, but I wrote the code in myself.
router.get("/", async (req, res) => {
  const filter = {};
  if (req.query.island) {
    filter.island = req.query.island;
  }
// Allows filtering by averageRating using minRating and maxRating params. If min or max rating is provided, it adds a filter for averageRating.
// Min sets ratings greater than or equal to the value, max sets ratings less than or equal to the value. 
//AI assisted with this section. 
if (req.query.minRating || req.query.maxRating) {
  filter.averageRating = {};

  if (req.query.minRating) {
    filter.averageRating.$gte = Number(req.query.minRating);
  }

  if (req.query.maxRating) {
    filter.averageRating.$lte = Number(req.query.maxRating);
  }
}

  const properties = await Property.find(filter);
  res.render("properties", { properties });

});

// GET/properties/:id
router.get("/:id", async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });
    res.json(property);
});

// POST/properties/:id/reviews
router.post("/:id/reviews", async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ error: "Not found" });
    property.reviews.push(req.body);
    // AI assisted
    // Allows averageRating to be updated after adding a review
    const total = property.reviews.reduce((sum, review) => sum + review.rating, 0);
    property.averageRating = total / property.reviews.length;

    await property.save();
    res.status(201).json(property);
});

module.exports = router;