const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../config/validateToken");

const User = mongoose.models.User;

const validateUser = async (req, res, next) => {
  try {
    const { email: userEmail, password: reqPass } = req.body;

    const user = await User.findOne({ email: userEmail });

    const { _id } = user;

    if (!user) {
      return res.status(401).json({
        message: "Email does not exist",
        status: 401,
      });
    }

    const isMatch = await bcrypt.compare(reqPass, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: 401,
      });
    }

    const { firstName, location, phone, email, password: userPass } = user;

    const userObject = {
      _id,
      firstName,
      location,
      phone,
      email,
      password: userPass,
    };

    const accessToken = generateAccessToken(userObject);
    const refreshToken = generateRefreshToken(userObject);

    userObject.accessToken = accessToken;
    userObject.refreshToken = refreshToken;

    const { password, ...userWithoutPassword } = userObject;
    res.locals.userData = userWithoutPassword;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

router.post("/api/login", validateUser, async (req, res) => {
  const { userData } = res.locals;
  res.status(200).json({
    message: "Login success",
    status: 200,
    userData,
  });
});

module.exports = router;
