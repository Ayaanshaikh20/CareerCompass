const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../config/generateTokens");
const dbConnect = require("../config/dbConnect");

const validateUser = async (req, res, next) => {
  try {
    //dbConnect
    const db = await dbConnect();
    const users = db.collection("users");

    const { email: userEmail, password: reqPass } = req.body;

    const user = await users.findOne({ email: userEmail });

    if (!user) {
      return res.status(401).json({
        message: "Email does not exist",
        status: 401,
      });
    }

    const { _id, firstName, location, phone, email, password: userPass } = user;

    const isMatch = await bcrypt.compare(reqPass, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: 401,
      });
    }

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

    const { password, ...userWithoutPassword } = userObject;
    res.locals.userData = userWithoutPassword;
    res.locals.accessToken = accessToken;
    res.locals.refreshToken = refreshToken;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

router.post("/api/login", validateUser, async (req, res) => {
  const { userData, accessToken, refreshToken } = res.locals;
  res.status(200).json({
    message: "Login success",
    status: 200,
    userData,
    accessToken,
    refreshToken,
  });
});

module.exports = router;
