const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2m",
  });
  res.cookie("a_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 2 * 60 * 1000, // 2 minutes in milliseconds
  });
};

// Generate refresh token on login.
const generateRefreshToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("r_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 30 minutes in milliseconds
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
