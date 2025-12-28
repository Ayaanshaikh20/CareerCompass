const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const pool = require("../config/dbConnect");

const fetchUser = async (req, res, next) => {
    let con, sqlQuery
    try {
        //connect db
        con = await pool.connect();

        //request data
        const { userId } = req.query

        sqlQuery = `SELECT first_name, location, email, phone_number, user_id FROM register_users WHERE user_id='${userId}'`

        const result = await con.query(sqlQuery);

        if (result && result.rows.length > 0) {
            const { first_name: firstName, location, phone_number: phone, email, user_id: userId } = result.rows[0]
            res.locals.userDetails = {
                firstName,
                location,
                phone,
                email,
                userId
            }
        }
        next();
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    } finally {
        if (con) con.release();
    }
};

router.get("/api/fetch-user", verifyAccessToken, fetchUser, async (req, res) => {
    const { userDetails } = res.locals;
    res.status(200).json({
        status: 200,
        message: "User details fetched successfully",
        userDetails
    })
});

module.exports = router;