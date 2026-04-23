const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const Property = require("../models/Property");

const router = express.Router();

function getAverageRating(reviews = []) {
  if (!reviews.length) return 0;

  const total = reviews.reduce((sum, review) => {
    return sum + Number(review.rating || 0);
  }, 0);

  return total / reviews.length;
}

router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const properties = await Property.find({}).lean();

    const propertiesWithComputedRatings = properties.map(property => {
      const reviewCount = property.reviews ? property.reviews.length : 0;
      const computedAverageRating = getAverageRating(property.reviews || []);

      return {
        ...property,
        reviewCount,
        computedAverageRating
      };
    });

    const totalReviews = propertiesWithComputedRatings.reduce((sum, property) => {
      return sum + property.reviewCount;
    }, 0);

    const primaryProperty = propertiesWithComputedRatings.find(
      property => property.name === "Lava Birds B&B"
    ) || propertiesWithComputedRatings[0] || null;

    const contactMessages = primaryProperty && primaryProperty.contactMessages
      ? [...primaryProperty.contactMessages].reverse()
      : [];

    res.render("admin/dashboard", {
      user: req.user,
      properties: propertiesWithComputedRatings,
      totalReviews,
      primaryProperty,
      contactMessages,
      success: req.query.updated === "true"
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/special-offer", isAuthenticated, async (req, res) => {
  try {
    const property = await Property.findOne({ name: "Lava Birds B&B" });
    if (!property) {
      return res.status(404).send("Property not found");
    }

    property.specialOffer = String(req.body.specialOffer || "").trim();
    property.specialOfferDetails = String(req.body.specialOfferDetails || "").trim();

    await property.save();
    res.redirect("/admin/dashboard?updated=true");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/contact-messages/delete-selected", isAuthenticated, async (req, res) => {
  try {
    const property = await Property.findOne({ name: "Lava Birds B&B" });

    if (!property) {
      return res.status(404).send("Property not found");
    }

    let selectedIds = req.body.messageIds || [];

    if (!Array.isArray(selectedIds)) {
      selectedIds = [selectedIds];
    }

    property.contactMessages = property.contactMessages.filter(message => {
      return !selectedIds.includes(String(message._id));
    });

    await property.save();

    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
