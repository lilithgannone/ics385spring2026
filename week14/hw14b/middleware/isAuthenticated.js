// middleware/isAuthenticated.js
// Apply this middleware to any route that should only be accessible when logged in.
module.exports = function isAuthenticated(req, res, next) {
if (req.isAuthenticated()) return next(); // user is logged in — proceed
res.redirect('/login'); // not logged in — redirect
};
// Usage in routes/auth.js:
// const isAuthenticated = require('../middleware/isAuthenticated');
// router.get('/profile', isAuthenticated, (req, res) => { ... });