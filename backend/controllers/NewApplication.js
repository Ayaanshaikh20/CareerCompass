const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const pool = require("../config/dbConnect");

// Controller
const createApplication = async (req, res, next) => {
  let sqlQuery, con;
  try {
    // connect db
    con = await pool.connect();

    const applicationData = req.body;

    const {
      userId: user_id,
      role,
      appliedDate: applied_date,
      package,
      employer,
      location,
      jobLink: job_link,
      experience,
      platform,
      jobDescription: job_description,
      status
    } = applicationData;

    sqlQuery = `INSERT INTO applications(
      user_id, status, job_link, role, experience, platform, applied_date, job_description, employer, package, location
    ) VALUES (
      '${user_id}','${status}','${job_link}','${role}','${experience}','${platform}','${applied_date}','${job_description}','${employer}','${package}', '${location}'
    ) `

    const result = await con.query(sqlQuery);

    if (result) {
      next();
    };
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
      error: error.message,
    });
  } finally {
    if (con) con.release();
  }
};

// Route
router.post("/api/new-application", verifyAccessToken, createApplication, async (req, res) => {
  const { newApplication } = res.locals;
  res.status(201).json({
    status: 201,
    message: "New application created",
    newApplication,
  });
});

module.exports = router;
