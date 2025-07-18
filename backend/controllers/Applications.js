const { Router } = require("express");
const { verifyAccessToken } = require("../config/generateTokens");
const pool = require("../config/dbConnect");

const router = Router();

const fetchApplication = async (req, res, next) => {
  let sqlQuery, con;
  try {

    // connect db
    con = await pool.connect();

    //request data
    const { user_id } = req.query;

    sqlQuery = `SELECT * FROM applications WHERE user_id='${user_id}'`;

    const result = await con.query(sqlQuery);

    if (!result || result.rows.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No applications",
      });
    }

    let newArr = result.rows.map((item) => ({
      id: item.id,
      user_id: item.user_id,
      status: item.status,
      jobLink: item.job_link,
      role: item.role,
      experience: item.experience,
      platform: item.platform,
      appliedDate: item.applied_date,
      jobDescription: item.job_description,
      employer: item.employer,
      package: item.package,
      location: item.location
    }));

    res.locals.applications = newArr;

    next();

  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    if (con) con.release();
  }
};

router.get("/api/applications", verifyAccessToken, fetchApplication, async (req, res) => {
  const { applications } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Fetched successfully",
    applications,
  });
});

module.exports = router;
