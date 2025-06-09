const { Router } = require("express");
const { verifyAccessToken } = require("../config/generateTokens");
const dbConnect = require("../config/dbConnect");

const router = Router();

const fetchApplication = async (req, res, next) => {
  const db = await dbConnect();
  const appliedjobs = db.collection("appliedjobs");

  const { userId } = req.params;
  const result = await appliedjobs.find({ userId }).toArray();
  if (!result || result.length === 0) {
    return res.status(200).json({
      status: 200,
      message: "No applications",
    });
  }

  res.locals.applications = result;
  next();
};

router.get("/api/applications/:userId", verifyAccessToken, fetchApplication, async (req, res) => {
  const { applications } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Fetched successfully",
    applications,
  });
});

module.exports = router;
