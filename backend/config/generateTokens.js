const jwt = require("jsonwebtoken");

const generateAccessToken = (userObject) => {
  return jwt.sign(userObject, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

const generateRefreshToken = (userObject) => {
  return jwt.sign(userObject, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const verifyAccessToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
};
