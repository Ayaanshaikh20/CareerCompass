const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = mongoose.models.User;

const validateUser = async (req, res, next) => {
  const { email, password: reqPass } = req.body;
  try {
    const user = await User.findOne({ email });
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

    const { password, ...userWithoutPassword } = user.toObject();
    res.locals.userDetails = userWithoutPassword;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
    });
  }
};

router.post("/api/login", validateUser, async (req, res) => {
  const { userDetails } = res.locals;
  res.status(200).json({
    message: "Login success",
    status: 200,
    userDetails,
  });
});

module.exports = router;
