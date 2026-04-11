const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Manually coded: used codex to understand what was needed for ejs.
// Import path module and load environment variables from .env file
const path = require("path");
require("dotenv").config();

// Create the Express app
const app = express();

// needed to fix bug I encountered with CORS policy when trying to fetch data from the backend to the frontend.
app.use(cors());
// Middleware- JSON data
app.use(express.json());
// Middleware- form data
app.use(express.urlencoded({ extended: true }));

//
//Manually coded: used codex to understand what was needed to set up ejs.
// Set EJS as the template
app.set("view engine", "ejs");

//shows where the EJS templates are located
app.set("views", path.join(__dirname, "views"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection error:", err));

const propertyRoutes = require("./routes/properties");
app.use("/properties", propertyRoutes);

// API route matching /api/properties/:id
const propertyApiRoutes = require("./routes/propertyAPI");
app.use("/api/properties", propertyApiRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});