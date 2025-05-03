const { Router } = require("express");
const router = Router();
const { generateAccessToken } = require("../config/validateToken");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = mongoose.models.User;

router.post("/api/refresh-token", async (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(403).json({
          message: "expired",
          status: 403,
        });
      const { firstName, email, phone, location, password } = decoded;
      const newAccessToken = generateAccessToken({
        firstName,
        email,
        phone,
        location,
        password,
      });

      const user = await User.findOne({ email: email });

      if (!user) {
        return res.sendStatus(404);
      }

      user.accessToken = newAccessToken;

      await user.save();

      res.json({ accessToken: newAccessToken });
    }
  );
});

module.exports = router;
