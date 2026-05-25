const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// FACEBOOK
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/facebook/callback`,
    profileFields: ["id", "displayName", "emails"]
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const facebookId = profile.id;
      const email = profile.emails?.[0]?.value || `${facebookId}@facebook.local`;

      let user = await User.findOne({ facebookId });
      if (!user) {
        // If user already exists by email, link accounts
        user = await User.findOne({ email }) || new User({
          name: profile.displayName || "Facebook User",
          email,
          password: "oauth_no_password", // or make password optional in schema
          authProvider: "facebook",
          facebookId
        });

        user.facebookId = facebookId;
        user.authProvider = "facebook";
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// GOOGLE
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value || `${googleId}@google.local`;

      let user = await User.findOne({ googleId });
      if (!user) {
        user = await User.findOne({ email }) || new User({
          name: profile.displayName || "Google User",
          email,
          password: "oauth_no_password",
          authProvider: "google",
          googleId
        });

        user.googleId = googleId;
        user.authProvider = "google";
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
module.exports = passport;