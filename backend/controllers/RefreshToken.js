const { Router } = require("express");
const router = Router();
const { generateAccessToken } = require("../config/generateTokens");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConnect");

router.post("/refresh-token", async (req, res) => {
  let sqlQuery, con;
  try {
    // connect db
    con = await pool.connect();

    const { r_t: refreshToken } = req.cookies;

    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {

      //user not verified so unauthorized and log them out
      if (err) return res.sendStatus(401);

      const { id } = decoded;

      sqlQuery = `SELECT * FROM register_users WHERE user_id='${id}'`;

      const result = await con.query(sqlQuery);

      const user = result.rows[0];

      if (!user) return res.sendStatus(404);

      generateAccessToken(id, res);

      res.status(200).json({
        status: 200,
        message: "Access token generated",
        data: {
          userId: id,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  } finally {
    if (con) con.release();
  }
});

module.exports = router;
