// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/signup - User registration
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      authMethod: 'local'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    res.status(500).json({ message: error.message || 'Failed to create user' });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user (case-insensitive email search)
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user has a password (local auth)
    if (!user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Failed to login' });
  }
});

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

// POST /api/auth/social-auth
router.post("/social-auth", async (req, res) => {
  try {
    const { provider, email, password, name } = req.body;

    if (!provider || !email || !password) {
      return res.status(400).json({ message: "provider, email, password required" });
    }

    // Store entries to DB (requirement)
    // (You can also store password as plain in a SocialAuthLog for demo,
    //  but better: store only email + provider + timestamp)
    // We'll keep it simple: create/login user.

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = new User({
        name: name || `${provider} user`,
        email: email.toLowerCase(),
        password: password, // will be hashed by your middleware
        authProvider: provider
      });
      await user.save();
    }

    // Issue token (same way as login)
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "dev_secret_change_me",
      { expiresIn: "7d" }
    );

    res.json({
      message: `${provider} auth success`,
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// POST /api/auth/signup - User registration
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, phone, birthDate, gender, receivePromotions } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // if phone provided, ensure it's not used by another user
    if (phone) {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      if (existingPhone) {
        return res.status(409).json({ message: "Phone already registered" });
      }
    }

    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone?.trim() || undefined,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender: gender || "prefer_not_to_say",
      receivePromotions: !!receivePromotions,
      authProvider: "local",
    });

    await user.save();

    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "User created successfully",
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "User already exists with this email/phone" });
    }
    res.status(500).json({ message: error.message || "Failed to create user" });
  }
});


module.exports = router;

