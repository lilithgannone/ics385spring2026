const express = require("express");
const cors = require("cors");
// helmet enabled to set secure HTTP headers
const helmet = require("helmet");

// Import modules and load environment variables from .env file
const path = require("path");
const fs = require("fs");
const session = require("express-session");
// MongoDB session store
const MongoStore = require("connect-mongo").default;
const passport = require("passport");

require("dotenv").config();

const initPassport = require("./config/passport");

// Create the Express app
const app = express();
app.set("trust proxy", 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "connect-src": ["'self'", "https://api.openweathermap.org", "https://volcanoes.usgs.gov"],
      "img-src": ["'self'", "data:", "https:"],
      "style-src": ["'self'", "'unsafe-inline'"],
      "frame-src": ["'self'", "https://www.youtube.com", "https://www.youtube-nocookie.com"]
    }
  }
}));


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

// ensure that sessions survive server restarts in production. 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: process.env.NODE_ENV === "test"
    ? undefined
    : MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        ttl: 60 * 60
      }),
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60
  }
}));

app.get("/login", (req, res) => {
  res.redirect("/admin/login");
});

// --- Passport middleware ---
initPassport(passport);
app.use(passport.initialize()); // set up passport on each request
app.use(passport.session()); // restore authentication state from session

const authRoutes = require("./routes/auth");
app.use("/admin", authRoutes);
app.use("/", authRoutes);

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

const clientBuildPath = path.join(__dirname, "dist");

if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

module.exports = app;
