// import express and create a router
const express = require("express");
const router = express.Router();
const originData = require("../data/originData.json");

router.get("/", (req, res) => {
  const island = req.query.island || "Hawaii Island";

  const islandRows = originData.filter((row) => row.Destination === island);

  if (!islandRows.length) {
    return res.status(404).json({ error: "Island not found" });
  }

  function getMarketValue(marketName) {
    const match = islandRows.find((row) => row.Market === marketName);
    if (!match) return 0;
    return Number(String(match["2025"]).replace(/,/g, ""));
  }

  res.json({
    labels: ["U.S. Domestic", "Japan", "Canada", "Other International"],
    values: [
      getMarketValue("U.S. domestic"),
      getMarketValue("Japan"),
      getMarketValue("Canada"),
      getMarketValue("Other International")
    ]
  });
});

module.exports = router;
