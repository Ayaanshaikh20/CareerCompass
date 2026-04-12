const { Router } = require("express");
const router = Router();
const pool = require("../../config/dbConnect");

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
        res.status(500).json({ status: 500, message: "Error updating profile" });
    } finally {
        if (con) con.release();
    }
};

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
        res.status(500).json({ status: 500, message: "Error fetching user" });
    } finally {
        if (con) con.release();
    }
};

router.get("/api/fetch-user", fetchUser, async (req, res) => {
    const { userDetails } = res.locals;
    res.status(200).json({
        status: 200,
        message: "User details fetched successfully",
        userDetails
    })
});

router.post("/api/edit-profile", updateProfile, async (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Profile updated successfully",
    });
});

module.exports = router;