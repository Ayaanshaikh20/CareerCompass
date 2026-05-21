const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5m", // 5 minute
  });
  res.cookie("a_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
  });
};

// Generate refresh token on login.
const generateRefreshToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d", // 1 day
  });
  res.cookie("r_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
};

const verifyAccessToken = (req, res, next) => {
  const { a_t } = req.cookies;

  if(!a_t) return res.status(401).json({ message: "Session expired", code: "ACCESS_TOKEN_MISSING" });

  jwt.verify(a_t, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Check if the error is due to token expiration
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired", code: "TOKEN_EXPIRED" });
      }
      // For other errors
      return res.status(401).json({ message: "Invalid token", code: "INVALID_TOKEN" });
    }
    // Attach user ID to request for use in subsequent handlers
    req.userId = decoded.id;
    next();
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
