const { Router } = require("express");
const dbConnect = require("../config/dbConnect");
const { generateAccessToken, generateRefreshToken } = require("../config/generateTokens");
const bcrypt = require("bcrypt");

const router = Router();

// Middleware: Generate JWT Tokens
const generateTokens = (req, res, next) => {
  const accessToken = generateAccessToken(req.body);
  const refreshToken = generateRefreshToken(req.body);

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
    //dbConnect
    const db = await dbConnect();
    const users = db.collection("users");

    const { email, firstName, location, password, phone, accessToken, refreshToken } = res.locals.userDetails;

    // Check if user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ status: 400, message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and insert new user
    const newUser = {
      firstName,
      location,
      phone,
      email,
      password: hashedPassword,
    };
    const result = await users.insertOne(newUser);

    const userData = {
      _id: result.insertedId,
      firstName,
      email,
      phone,
    };

    // Remove password from userDetails for response
    res.locals.userData = userData;
    res.locals.accessToken = accessToken;
    res.locals.refreshToken = refreshToken;

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// Register Route
router.post("/api/register", generateTokens, storeUser, (req, res) => {
  const { userData, accessToken, refreshToken } = res.locals;
  res.status(201).json({
    status: 201,
    message: "User registered successfully",
    userData,
    accessToken,
    refreshToken,
  });
});

module.exports = router;
