const { Router } = require("express");
const router = Router();
const { generateAccessToken } = require("../config/generateTokens");
const jwt = require("jsonwebtoken");
const pool = require("../config/dbConnect");

router.post("/api/refresh-token", async (req, res) => {

  let sqlQuery, con;

  // connect db
  con = await pool.connect();

  const refreshToken = req.body.token;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {

    if (err) return res.sendStatus(403);

    const { firstName, email, phone, location, password } = decoded;

    sqlQuery = `SELECT * FROM register_users WHERE email='${email}'`

    const result = await con.query(sqlQuery);

    const user = result.rows[0];

    if (!user) return res.sendStatus(404);

    const newAccessToken = generateAccessToken({ firstName, email, phone, location, password });

    res.status(200).json({
      status: 200,
      message: "Access token generated",
      accessToken: newAccessToken
    });
  });
});

module.exports = router;
