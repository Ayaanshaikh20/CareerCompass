const { Router } = require("express");
const router = Router();
const { generateAccessToken } = require("../config/generateTokens");
const jwt = require("jsonwebtoken");
const dbConnect = require("../config/dbConnect");

router.post("/api/refresh-token", async (req, res) => {
  const db = await dbConnect();
  const users = db.collection("users");

  const refreshToken = req.body.token;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.sendStatus(403);

    const { firstName, email, phone, location, password } = decoded;
    const user = await users.findOne({ email });
    if (!user) return res.sendStatus(404);

    const newAccessToken = generateAccessToken({ firstName, email, phone, location, password });

    res.status(200).json({ status: 200, message: "Access token generated", accessToken: newAccessToken });
  });
});

module.exports = router;
