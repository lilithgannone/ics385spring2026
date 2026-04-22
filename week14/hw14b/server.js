// server.js — relevant middleware additions (integrate with your existing file)
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const passport = require('passport');
const initPassport = require('./passport-config');
const app = express();


app.use(express.urlencoded({ extended: true })); // parse HTML form bodies
app.use(express.json());

// --- Session middleware (must come BEFORE passport.initialize()) ---
app.use(session({
secret: process.env.SESSION_SECRET, // random string stored in .env
resave: false, // don't save session if unmodified
saveUninitialized: false, // don't create session for anonymous users
store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
cookie: { secure: false } // set to true when using HTTPS in production
}));

// --- Passport middleware ---
initPassport(passport);
app.use(passport.initialize()); // set up passport on each request
app.use(passport.session()); // restore authentication state from session

// --- Mount routes ---
app.use('/', require('./routes/auth')); // login + logout

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});



