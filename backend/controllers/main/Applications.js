const { Router } = require("express");
const pool = require("../../config/dbConnect");

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
      interviewDate: item.interview_date,
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

const deleteApplication = async (req, res, next) => {
  let sqlQuery, con;
  try {
    // connect db
    con = await pool.connect();

    const { user_id, application_id } = req.query;

    sqlQuery = `DELETE FROM applications WHERE user_id='${user_id}' AND id='${application_id}'`

    const result = await con.query(sqlQuery);

    if (!result) {
      return res.status(404).json({ status: 404, message: "Application not found" });
    }
    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error deleting application" });
  } finally {
    if(con) con.release()
  }
};

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
      interviewDate: interview_date,
      package,
      employer,
      location,
      jobLink: job_link,
      experience,
      platform,
      jobDescription: job_description,
      status,
    } = applicationData;

    sqlQuery = `INSERT INTO applications(
      user_id, status, job_link, role, experience, platform, applied_date, interview_date, job_description, employer, package, location
    ) VALUES (
      '${user_id}','${status}','${job_link}','${role}','${experience}','${platform}','${applied_date}', '${interview_date}','${job_description}','${employer}','${package}', '${location}'
    ) `;

    const result = await con.query(sqlQuery);

    if (result) {
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error creating new application",
    });
  } finally {
    if (con) con.release();
  }
};

router.post("/api/new-application", createApplication, async (req, res) => {
  const { newApplication } = res.locals;
  res.status(201).json({
    status: 201,
    message: "New application created",
    newApplication,
  });
});

router.post("/api/edit-application", editApplication, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application updated successfully",
  });
});

router.delete("/api/delete-application", deleteApplication, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application deleted successfully",
  });
});

router.get("/api/applications", fetchApplication, async (req, res) => {
  const { applications } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Fetched successfully",
    applications,
  });
});

module.exports = router;
