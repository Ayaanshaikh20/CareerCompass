const { Router } = require("express");
const mongoose = require("mongoose");
const dbConnect = require("../config/dbConnect");
const { generateAccessToken, generateRefreshToken } = require("../config/validateToken");
const bcrypt = require("bcrypt");

const router = Router();

// Define Schema and Model
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  firstName: { type: String, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: { type: String },
  refreshToken: { type: String },
});

const User = mongoose.model("User", userSchema);

// Middleware: Generate JWT Tokens
const generateTokens = (req, res, next) => {
  const { id } = req.body;
  const accessToken = generateAccessToken(id);
  const refreshToken = generateRefreshToken(id);

  res.locals.userDetails = {
    ...req.body,
    accessToken,
    refreshToken,
  };

  next();
};

// Middleware: Store User in DB
const storeUser = async (req, res, next) => {
  try {
    const { id, email, firstName, location, password, phone, accessToken, refreshToken } = res.locals.userDetails;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 400, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user
    const newUser = new User({
      id,
      firstName,
      location,
      phone,
      email,
      password: hashedPassword,
      accessToken,
      refreshToken,
    });

    await newUser.save();

    // Remove password from userDetails for response
    const { password: _, ...safeUserDetails } = res.locals.userDetails;
    res.locals.userDetails = safeUserDetails;

    next();
  } catch (error) {
    console.error("Error storing user:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Register Route
router.post("/api/register", generateTokens, storeUser, (req, res) => {
  const { userDetails } = res.locals;
  res.status(201).json({
    status: 201,
    message: "User registered successfully",
    userDetails,
  });
});

module.exports = router;
