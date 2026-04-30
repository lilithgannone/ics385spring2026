// both local and google strategies for passport authentication
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

//local and google strategies for passport authentication with fund, link, create logic for google strategy. 
module.exports = function initializePassport(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: String(email).toLowerCase() });

          if (!user) {
            return done(null, false, { message: "Email not found." });
          }

          const match = await user.comparePassword(password);

          if (!match) {
            return done(null, false, { message: "Incorrect password." });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails && profile.emails[0]
            ? profile.emails[0].value.toLowerCase()
            : "";

          const verified = profile.emails && profile.emails[0]
            ? profile.emails[0].verified
            : false;

          let user = await User.findOne({ googleId: profile.id });

          if (!user && verified && email) {
            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              user.provider = user.provider || "local";
              await user.save();
            }
          }

        let createdUser = false;

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email,
            provider: "google"
          });

          createdUser = true;
        }

        user.wasCreated = createdUser;

        return done(null, user);

        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
