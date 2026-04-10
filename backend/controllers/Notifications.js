const { Router } = require("express");
const pool = require("../config/dbConnect");

const router = Router();

router.get("/api/notifications", async (req, res) => {
  let con;
  try {
    con = await pool.connect();
    const { user_id } = req.query;

    const result = await con.query(
      `SELECT id, role, employer, interview_date, status 
       FROM applications 
       WHERE user_id=$1 AND interview_date IS NOT NULL AND status != 'Rejected'`,
      [user_id]
    );

    const now = new Date();
    const notifications = result.rows
      .map(app => {
        const interviewDate = new Date(app.interview_date);
        const daysLeft = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft >= 0 && daysLeft <= 5) {
          return {
            id: app.id,
            role: app.role,
            employer: app.employer,
            interviewDate: app.interview_date,
            daysLeft,
            message: daysLeft === 0 
              ? "Interview today!" 
              : daysLeft === 1 
              ? "Interview tomorrow!" 
              : `Interview in ${daysLeft} days`
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    res.status(200).json({ status: 200, notifications });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error fetching notifications" });
  } finally {
    if (con) con.release();
  }
});

module.exports = router;
