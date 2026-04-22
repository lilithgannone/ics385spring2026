// seed-admin.js — run once: node seed-admin.js
// to register an admin
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
async function seedAdmin() {
await mongoose.connect(process.env.MONGODB_URI);
const existing = await User.findOne({ email: 'admin@yourproperty.com' });
if (existing) { console.log('Admin already exists.'); process.exit(0); }
const admin = new User({
email: 'admin@yourproperty.com', // ← change to your email
password: 'SecurePass123!' // ← bcrypt pre-save hook hashes this
});

await admin.save();
console.log('Admin user created successfully!');
mongoose.disconnect();
}
seedAdmin().catch(console.error);