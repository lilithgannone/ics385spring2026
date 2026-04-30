const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

// provider enum added 
const userSchema = new mongoose.Schema({
  googleId: { type: String, index: true, sparse: true},
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String},
  provider: { type: String, enum: ["local", "google"], default: "local" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")|| !this.password) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

userSchema.methods.comparePassword = function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
