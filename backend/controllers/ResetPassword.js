const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const pool = require("../config/dbConnect");

const router = Router();

const resetPassword = async (req, res, next) => {
  let con;
  try {
    const { password, confirmPassword, token } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Invalid request",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Passwords do not match",
      });
    }

    con = await pool.connect();

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const tokenQuery = `
      SELECT *
      FROM forget_password
      WHERE token = $1
        AND expires_in > NOW()
        AND is_used = false
    `;

    const tokenResult = await con.query(tokenQuery, [hashedToken]);

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Reset token is invalid or expired",
      });
    }

    const { email, id: resetId } = tokenResult.rows[0];

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUserQuery = `
      UPDATE register_users
      SET password = $1
      WHERE email = $2
    `;

    await con.query(updateUserQuery, [hashedPassword, email]);

    const invalidateTokenQuery = `
      UPDATE forget_password
      SET is_used = true
      WHERE id = $1
    `;

    await con.query(invalidateTokenQuery, [resetId]);

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  } finally {
    if (con) con.release();
  }
};

router.post("/reset-password", resetPassword, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Password changed successfully. Please login with your new password.",
  });
});

module.exports = router;
