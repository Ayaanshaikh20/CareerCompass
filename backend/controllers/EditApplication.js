const { Router } = require("express");
const router = Router();
const pool = require("../config/dbConnect");

const editApplication = async (req, res, next) => {
  let sqlQuery, con;
  try {
    // connect db
    con = await pool.connect()

    const { id, role, appliedDate, package, employer, location, jobLink, experience, platform, jobDescription, status, interviewDate } = req.body;

    sqlQuery = `UPDATE applications
      SET role='${role}', 
      applied_date='${appliedDate}', 
      package='${package}', 
      employer='${employer}', 
      location='${location}', 
      job_link='${jobLink}',
      interview_date='${interviewDate}',
      experience='${experience}',
      platform='${platform}',
      job_description='${jobDescription}',
      status='${status}'
      WHERE id='${id}';`

    const result = await con.query(sqlQuery);

    if (!result) {
      return res.status(404).json({
        status: 404,
        message: "Application not found",
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating application",
    });
  } finally {
    if(con) con.release();
  }
};

// Route
router.post("/api/edit-application", editApplication, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application updated successfully",
  });
});

module.exports = router;
