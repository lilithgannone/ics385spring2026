// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10; // NIST recommends >= 10; higher = slower (more secure)

const userSchema = new mongoose.Schema({
email: { type: String, required: true, unique: true, lowercase: true },
password: { type: String, required: true },
role: { type: String, enum: ['user', 'admin'], default: 'user' },
createdAt:{ type: Date, default: Date.now }
});

// --- Pre-save hook: hash the password before writing to DB ----
// This middleware runs automatically whenever user.save() is called.
// 'this' refers to the document being saved.
userSchema.pre('save', async function () {
if (!this.isModified('password')) return; // skip if not changed
this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// --- Instance method: compare a candidate password to the stored hash ---
userSchema.methods.comparePassword = function (candidate) {
return bcrypt.compare(candidate, this.password); // returns a Promise<boolean>
};

module.exports = mongoose.model('User', userSchema);