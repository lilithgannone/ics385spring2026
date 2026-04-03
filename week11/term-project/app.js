const express = require("express");
const mongoose = require("mongoose");

//AI assistance: I wrote this in myself but used Codex to understand what was needed for ejs.
// Import path module and load environment variables from .env file
const path = require("path");
require("dotenv").config();

// Create the Express app
const app = express();

// Middleware- JSON data
app.use(express.json());
// Middleware- form data
app.use(express.urlencoded({ extended: true }));

//
//AI assistance: I wrote this in myself but used Codex and ChatGPT to understand what was needed to set up ejs.
// Set EJS as the template
app.set("view engine", "ejs");

//shows where the EJS templates are located
app.set("views", path.join(__dirname, "views"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection error:", err));

const propertyRoutes = require("./routes/properties");
app.use("/properties", propertyRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});