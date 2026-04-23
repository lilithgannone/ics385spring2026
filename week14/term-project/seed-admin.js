require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@lavabirdsbb.com" });

  if (existing) {
    console.log("Admin already exists.");
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = new User({
    email: "admin@lavabirdsbb.com",
    password: "LavaBirdsAdmin123!",
    role: "admin"
  });

  await admin.save();
  console.log("Admin user created successfully!");
  await mongoose.disconnect();
}

seedAdmin().catch(async err => {
  console.error(err);
  await mongoose.disconnect();
});
