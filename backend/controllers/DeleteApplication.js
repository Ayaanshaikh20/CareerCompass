const { Router } = require("express");
const router = Router();
const pool = require("../config/dbConnect");

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

router.delete("/api/delete-application", deleteApplication, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application deleted successfully",
  });
});

module.exports = router;
