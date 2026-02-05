const crypto = require("crypto");
const { Router } = require("express");
const pool = require("../config/dbConnect");
const expressRateLimit = require("express-rate-limit");
const config = require("../config/env");

const router = Router();

const limiterMiddleware = expressRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2, // limit each IP to 2 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests, please try again after 5 minutes",
  },
});

const isProd = process.env.NODE_ENV === "production";

const forgotPassword = async (req, res, next) => {
  let sqlQuery, con;
  try {
    con = await pool.connect();

    const { email } = req.body;

    sqlQuery = `SELECT * FROM register_users WHERE email=$1`;

    const result = await con.query(sqlQuery, [email]);

    if (!result || result.rows.length === 0) {
      return res.status(404).json({
        status: 200,
        message: "Email does not exist",
      });
    }

    const { first_name, user_id } = result.rows[0];

    //check if token already created
    sqlQuery = `
    SELECT *
    FROM forget_password
    WHERE email = $1
    AND expires_in > NOW()
    AND is_used = false
    `;

    sqlQuery = `DELETE FROM forget_password where email=$1`;

    await con.query(sqlQuery, [email]);

    const id = crypto.randomUUID();

    // 1️⃣ Generate raw token
    const token = crypto.randomBytes(32).toString("hex");

    // 2️⃣ Hash token before saving
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const resObject = {
      id: id,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiresAt, // 5 min
      email: email,
    };

    sqlQuery = `INSERT INTO forget_password(id, token, expires_in, email) VALUES ($1, $2, $3, $4)`;

    await con.query(sqlQuery, [resObject.id, resObject.resetPasswordToken, resObject.resetPasswordExpires, resObject.email]);

    const resetLink = `${config.frontendUrl}/reset-password?t=${token}`;

    res.locals.tokenDetails = {
      resetLink,
      username: first_name,
      userId: user_id,
      expiresAt: expiresAt.toISOString(),
    };

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    if (con) con.release();
  }
};

router.post("/api/forget-password", limiterMiddleware, forgotPassword, async (req, res) => {
  const { tokenDetails } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Reset link has been sent to the registered email",
    tokenDetails,
  });
});

module.exports = router;
