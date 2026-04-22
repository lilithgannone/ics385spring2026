// routes/admin.js
const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const Property = require('../models/Property');
const router = express.Router();
// GET /admin/dashboard — protected: only accessible if logged in
// req.user is populated by Passport's deserializeUser
router.get('/dashboard', isAuthenticated, async (req, res) => {
try {
const properties = await Property.find({}); // load all properties
res.render('admin/dashboard', {
user: req.user, // the logged-in admin
properties: properties
});
} catch (err) {
res.status(500).send('Server error');
}
});
module.exports = router;