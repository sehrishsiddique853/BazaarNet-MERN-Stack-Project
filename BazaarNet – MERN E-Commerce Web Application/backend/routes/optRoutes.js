
const express = require("express");
const router = express.Router();
const twilio = require("twilio");
const User = require("../models/User");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

function normalizePhone(phone) {

  const p = (phone || "").trim();
  if (!p.startsWith("+")) throw new Error("Phone must be in E.164 format e.g. +923001234567");
  return p;
}

router.post("/request-otp", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);

    // optional: block if already registered
    const existing = await User.findOne({ phone });
    if (existing) return res.status(409).json({ message: "Phone already registered. Please login." });

    await client.verify.v2.services(VERIFY_SERVICE_SID)
      .verifications
      .create({ to: phone, channel: "sms" });

    res.json({ message: "OTP sent" });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to send OTP" });
  }
});


router.post("/verify-otp", async (req, res) => {
  try {
    const phone = normalizePhone(req.body.phone);
    const code = (req.body.code || "").trim();

    if (!code || code.length < 4) return res.status(400).json({ message: "Invalid code" });

    const check = await client.verify.v2.services(VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: phone, code });

    if (check.status !== "approved") {
      return res.status(401).json({ message: "Invalid or expired OTP" });
    }

    res.json({ verified: true });
  } catch (err) {
    res.status(400).json({ message: err.message || "Failed to verify OTP" });
  }
});


router.post("/signup-phone", async (req, res) => {
  try {
    const { phone, code, name, password, birthDate, gender, receivePromotions, email } = req.body;
    const normalizedPhone = normalizePhone(phone);

    if (!name || !password) return res.status(400).json({ message: "Name and password are required" });

    // Verify OTP again here (important: don’t trust frontend)
    const check = await client.verify.v2.services(VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: normalizedPhone, code: (code || "").trim() });

    if (check.status !== "approved") {
      return res.status(401).json({ message: "OTP not verified" });
    }

   
    const existing = await User.findOne({ phone: normalizedPhone });
    if (existing) return res.status(409).json({ message: "Phone already registered" });

    const user = new User({
      name,
      email: email || `${normalizedPhone.replace(/\+/g,"") }@phone.local`, // optional fallback
      password,
      phone: normalizedPhone,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender: gender || "prefer_not_to_say",
      receivePromotions: !!receivePromotions,
      authProvider: "local"
    });

    await user.save();

  
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "dev_secret_change_me",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created",
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "Signup failed" });
  }
});

module.exports = router;
