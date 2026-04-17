const express = require("express");
const router = express.Router();
const metricsData = require("../data/metricsData.json");

router.get("/", (req, res) => {
  const island = req.query.island || "Hawaii Island";

  const islandRows = metricsData.filter((row) => row.Category === island);

  if (!islandRows.length) {
    return res.status(404).json({ error: "Island not found" });
  }

  function getMetricValue(indicatorName) {
    const match = islandRows.find((row) => row.Indicator === indicatorName);
    return match ? match["2025"] : null;
  }

  res.json({
    adr: getMetricValue("Avg daily rate"),
    occupancy: getMetricValue("Occupancy"),
    lengthOfStay: getMetricValue("Length of stay")
  });
});

module.exports = router;
