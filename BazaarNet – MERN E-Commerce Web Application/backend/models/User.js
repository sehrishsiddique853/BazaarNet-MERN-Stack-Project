// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, unique: true, trim: true, lowercase: true },

    // keep required true because you use "oauth_no_password" placeholder for OAuth users
    password: { type: String, required: true, minlength: 6 },

    phone: { type: String, unique: true, sparse: true, trim: true },
    birthDate: { type: Date },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
      default: "prefer_not_to_say",
    },

    receivePromotions: { type: Boolean, default: false },

    authProvider: {
      type: String,
      enum: ["local", "facebook", "google"],
      default: "local",
    },

    facebookId: { type: String, sparse: true },
    googleId: { type: String, sparse: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  if (this.password && !this.password.startsWith("$2")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
