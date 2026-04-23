// import express and create a router
const express = require("express");
const router = express.Router();
const arrivalsData = require("../data/arrivalsData.json");

router.get("/", (req, res) => {
  const island = req.query.island || "Hawaii Island";

  const islandRow = arrivalsData.find((row) => row.Destination === island);

  if (!islandRow) {
    return res.status(404).json({ error: "Island not found" });
  }

  const monthlyData = Object.keys(islandRow)
    .filter((key) => /^\d{4}-\d{2}$/.test(key))
    .map((key) => ({
      month: key,
      arrivals: Number(String(islandRow[key]).replace(/,/g, ""))
    }));

  res.json(monthlyData);
});

module.exports = router;
