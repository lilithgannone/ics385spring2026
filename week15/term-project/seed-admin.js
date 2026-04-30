require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// replace adminEmail field with your email address to create an admin user
// admin@lavabirdsbb.com set up using old seed-admin.js file. This update was needed when we added Google Auth to make switching roles easier. 
async function seedAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = "gannone@hawaii.edu";

  let user = await User.findOne({ email: adminEmail });

  if (user) {
    user.role = "admin";
    await user.save();
    console.log("Existing user updated to admin.");
  } else {
    user = new User({
      email: adminEmail,
      password: "LavaBirdsAdmin123!",
      role: "admin",
      provider: "local"
    });

    await user.save();
    console.log("Admin user created successfully.");
  }

  await mongoose.disconnect();
}

seedAdmin().catch(async err => {
  console.error(err);
  await mongoose.disconnect();
});
