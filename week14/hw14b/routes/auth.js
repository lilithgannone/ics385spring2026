// routes/auth.js
const express = require('express');
const passport = require('passport');
const User = require('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');
const router = express.Router();

router.get('/register', (req, res) => {
res.send(`
<h1>Register for an Account</h1>
<form method="POST" action="/register">
<label>Email:</label><br>
<input type="email" name="email" required><br><br>

<label>Password:</label><br>
<input type="password" name="password" required><br><br>

<button type="submit">Register</button>
</form>
<p><a href="/login">Already have an account? Log in</a></p>
`);
});

router.post('/register', async (req, res) => {
try {
const { email, password } = req.body;

await User.create({ email, password }); 

res.redirect('/login');
} catch (err) {
console.error(err);
res.status(400).send(`

<h1>Registration Failed</h1>
<p>There was an error creating your account. Please try again.</p>
<p><a href="/register">Back to Register</a></p>

`);
}
});


router.get('/login', (req, res) => {
if (req.isAuthenticated()) return res.redirect('/profile');
res.send(`
<h1>Login</h1>
<form method="POST" action="/login">
<label>Email:</label><br>
<input type="email" name="email" required><br><br>

<label>Password:</label><br>
<input type="password" name="password" required><br><br>

<button type="submit">Login</button>
</form>
<p><a href="/register">Don't have an account? Register</a></p>
`);
});


router.post('/login',
passport.authenticate('local', {
successRedirect: '/profile',
failureRedirect: '/login',
failureFlash: false // set to true if you add connect-flash
})
);

router.get('/profile', isAuthenticated, (req, res) => {
res.send(`
<h1>Welcome, ${req.user.email}!</h1>
<p><strong>Email:</strong> ${req.user.email}</p>
<p><strong>Role:</strong> ${req.user.role}</p>
<p><a href="/logout">Logout</a></p>
`);
});

router.get('/logout', (req, res, next) => {
req.logout(err => { 
if (err) return next(err);
res.redirect('/login');
});
});
module.exports = router;