// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const homeRoutes = require('./routes/homeRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Connect to DB
connectDB();

const otpRoutes = require("./routes/optRoutes");
app.use("/api/auth", otpRoutes);

const session = require("express-session");
const passport = require("passport");

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


require("./config/passport"); // IMPORTANT: load strategies
app.use("/api/auth", require("./routes/oauthRoutes"));

// Routes
app.use('/api', homeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);


// Default route
app.get('/', (req, res) => {
  res.send('Daraz Backend API');
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});