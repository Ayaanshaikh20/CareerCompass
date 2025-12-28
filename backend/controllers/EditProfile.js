const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const pool = require("../config/dbConnect");

const updateProfile = async (req, res, next) => {
    let sqlQuery, con;
    try {
        //db connect
        con = await pool.connect();

        //fetch data
        const { firstName, location, phone, email, userId } = req.body;

        sqlQuery = `UPDATE register_users SET first_name='${firstName}', location='${location}', phone_number='${phone}', email='${email}' 
        WHERE user_id='${userId}'`

        await con.query(sqlQuery);

        next()
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    } finally {
        if (con) con.release();
    }
};

router.post("/api/edit-profile", verifyAccessToken, updateProfile, async (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Profile updated successfully",
    });
});

module.exports = router;