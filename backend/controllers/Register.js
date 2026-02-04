const { Router } = require("express");
const pool = require("../config/dbConnect");
const { generateAccessToken, generateRefreshToken } = require("../config/generateTokens");
const bcrypt = require("bcrypt");

const router = Router();

//check user exists
const checkUserExist = async (req, res, next) => {
  let sqlQuery, con;
  try {
    //connect db
    con = await pool.connect();

    // Extract email from request body
    const { email } = req.body;

    //check user query;
    sqlQuery = `SELECT * FROM register_users WHERE email=$1`;

    const result = await con.query(sqlQuery, [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ status: 400, message: "Email already registered" });
    }

    res.locals.userDetails = {
      ...req.body,
    };

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error registering user" });
  } finally {
    if (con) con.release();
  }
};

// Middleware: Generate JWT Tokens
const generateTokens = (req, res, next) => {
  //generate access token
  generateAccessToken(req.body, res);

  //generate refresh token
  generateRefreshToken(req.body, res);

  next();
};

// Middleware: Store User in DB
const storeUser = async (req, res, next) => {
  let sqlQuery, con;
  try {
    //connect db
    con = await pool.connect();

    const { email, firstName, location, password, phone } = res.locals.userDetails;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and insert new user
    const newUser = {
      firstName,
      location,
      phone,
      email,
      password: hashedPassword,
    };

    //insert user query
    sqlQuery = `INSERT INTO register_users (
    first_name, 
    location, 
    phone_number, 
    email, 
    password) VALUES (
    $1, 
    $2, 
    $3, 
    $4, 
    $5) RETURNING *`;

    const result = await con.query(sqlQuery, [newUser.firstName, newUser.location, newUser.phone, newUser.email, newUser.password]);

    const userData = {
      userId: result.rows[0].user_id,
      firstName: firstName,
      email,
      phone,
      location,
    };

    // Remove password from userDetails for response
    res.locals.userData = userData;

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error registering user" });
  } finally {
    if (con) con.release();
  }
};

// Register Route
router.post("/register", checkUserExist, generateTokens, storeUser, (req, res) => {
  const { userData } = res.locals;
  res.status(201).json({
    status: 201,
    message: "User registered successfully",
    userData,
  });
});

module.exports = router;
