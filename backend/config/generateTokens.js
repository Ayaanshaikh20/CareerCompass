const jwt = require("jsonwebtoken");

const generateAccessToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2m",
  });
  res.cookie("a_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const generateRefreshToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "5m",
  });
  res.cookie("r_t", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const verifyAccessToken = (req, res, next) => {
  const { a_t } = req.cookies;
  if (!a_t) return res.sendStatus(401);
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
