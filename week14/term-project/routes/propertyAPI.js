//setting up the API routes for the properties.
const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// GET /api/properties/:id → returns JSON
//define the route, pull the ID from the URL, and query MongoDB. Some error handling is included to manage cases where the property isn't found or if there's a server error.
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;