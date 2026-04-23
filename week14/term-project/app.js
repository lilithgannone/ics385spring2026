const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import modules and load environment variables from .env file
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");

require("dotenv").config();

const initPassport = require("./passport-config")

// Create the Express app
const app = express();

// needed to fix bug I encountered with CORS policy when trying to fetch data from the backend to the frontend.
app.use(cors());
// Middleware- JSON data
app.use(express.json());
// Middleware- form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//Manually coded: used codex to understand what was needed to set up ejs.
// Set EJS as the template
app.set("view engine", "ejs");

//shows where the EJS templates are located
app.set("views", path.join(__dirname, "views"));

// Prevent cached admin pages from being shown after logout.
app.use("/admin", (req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60
  }),
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

// --- Passport middleware ---
initPassport(passport);
app.use(passport.initialize()); // set up passport on each request
app.use(passport.session()); // restore authentication state from session

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Connection error:", err));


const authRoutes = require("./routes/auth");
app.use("/admin", authRoutes);

const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);

const propertyRoutes = require("./routes/properties");
app.use("/properties", propertyRoutes);

// API route matching /api/properties/:id
const propertyApiRoutes = require("./routes/propertyAPI");
app.use("/api/properties", propertyApiRoutes);

const arrivalsRoutes = require("./routes/arrivals");
app.use("/api/arrivals", arrivalsRoutes);

const originRoutes = require("./routes/origin");
app.use("/api/origin", originRoutes);

const metricsRoutes = require("./routes/metrics");
app.use("/api/metrics", metricsRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
