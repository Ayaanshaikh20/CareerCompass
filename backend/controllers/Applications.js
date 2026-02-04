const { Router } = require("express");
const pool = require("../config/dbConnect");

const router = Router();

const fetchApplication = async (req, res, next) => {
  let sqlQuery, con;
  try {

    // connect db
    con = await pool.connect();

    //request data
    const { user_id } = req.query;

    sqlQuery = `SELECT * FROM applications WHERE user_id=$1`;

    const result = await con.query(sqlQuery, [user_id]);

    if (!result || result.rows.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No applications",
        applications: []
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
    res.status(500).json({ status: 500, message: "Error fetching applications" });
  } finally {
    if (con) con.release();
  }
};

router.get("/applications", fetchApplication, async (req, res) => {
  const { applications } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Fetched successfully",
    applications,
  });
});

module.exports = router;
