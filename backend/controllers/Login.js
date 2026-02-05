const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../config/generateTokens");
const pool = require("../config/dbConnect");

const validateUser = async (req, res, next) => {
  let sqlQuery, con;
  try {
    // connect db
    con = await pool.connect();

    const { email: userEmail, password: reqPass } = req.body;

    sqlQuery = `SELECT * FROM register_users WHERE email=$1`;

    const result = await con.query(sqlQuery, [userEmail]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Email does not exist",
        status: 401,
      });
    }

    const { user_id, first_name, location, phone_number, email } = user;

    const isMatch = await bcrypt.compare(reqPass, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: 401,
      });
    }

    const userObject = {
      userId: user_id,
      firstName: first_name,
      location: location,
      phone: phone_number,
      email,
    };

    generateAccessToken(user_id, res);

    generateRefreshToken(user_id, res);

    res.locals.userData = userObject;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error validating user",
      mainError: error.message,
      status: 500,
    });
  } finally {
    if (con) con.release();
  }
};

router.post("/api/login", validateUser, async (req, res) => {
  const { userData } = res.locals;
  res.status(200).json({
    message: "Login success",
    status: 200,
    userData,
  });
});

module.exports = router;
