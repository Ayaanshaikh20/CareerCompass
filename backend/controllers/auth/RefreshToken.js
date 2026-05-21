const { Router } = require("express");
const router = Router();
const { generateAccessToken } = require("../../config/generateTokens");
const jwt = require("jsonwebtoken");
const pool = require("../../config/dbConnect");

router.post("/api/refresh-token", async (req, res) => {
  let con;
  try {
    const { r_t: refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing", code: "REFRESH_TOKEN_MISSING" });
    }

    // Verify refresh token
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const { id } = decoded;

    // Connect to database and verify user exists
    con = await pool.connect();
    const result = await con.query('SELECT user_id FROM register_users WHERE user_id=$1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found", code: "USER_NOT_FOUND" });
    }

    // Generate new access token
    generateAccessToken(id, res);

    res.status(200).json({
      status: 200,
      message: "Access token refreshed",
      data: {
        userId: id,
      },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired", code: "REFRESH_TOKEN_EXPIRED" });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid refresh token", code: "INVALID_REFRESH_TOKEN" });
    }
    res.status(500).json({ status: 500, message: "Internal server error" });
  } finally {
    if (con) con.release();
  }
});

module.exports = router;
