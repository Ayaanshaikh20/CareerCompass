const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../config/generateTokens");
const pool = require("../config/dbConnect");

const validateUser = async (req, res, next) => {
  let sqlQuery, con;
  try {
    // connect db
    con = await pool.connect()

    const { email: userEmail, password: reqPass } = req.body;

    sqlQuery = `SELECT * FROM register_users WHERE email='${userEmail}'`;

    const result = await con.query(sqlQuery);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Email does not exist",
        status: 401,
      });
    }

    const { user_id, firstName, location, phone, email, password: userPass } = user;

    const isMatch = await bcrypt.compare(reqPass, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: 401,
      });
    }

    const userObject = {
      user_id,
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
  } finally {
    if(con) con.release();
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
