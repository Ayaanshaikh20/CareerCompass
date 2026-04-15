const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h", // 1 hour
  });
  res.cookie("a_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
  });
};

// Generate refresh token on login.
const generateRefreshToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // 7 days
  });
  res.cookie("r_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

const verifyAccessToken = (req, res, next) => {
  const { a_t } = req.cookies;

  if(!a_t) return res.status(401).json({ message: "Session expired", code: "ACCESS_TOKEN_MISSING" });

  jwt.verify(a_t, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Check if the error is due to token expiration
      if (err.name === "TokenExpiredError") {
        return res.sendStatus(403);
      }
      // For other errors
      return res.sendStatus(401);
    }
    next();
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
