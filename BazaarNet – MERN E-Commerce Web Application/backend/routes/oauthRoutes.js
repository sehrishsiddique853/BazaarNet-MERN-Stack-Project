const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

function redirectWithToken(req, res) {
  // Passport puts user on req.user
  const user = req.user;

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Redirect back to frontend with token
  const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${token}`;
  return res.redirect(redirectUrl);
}

// Facebook start
router.get("/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Facebook callback
router.get("/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  redirectWithToken
);

// Google start
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  redirectWithToken
);

module.exports = router;
