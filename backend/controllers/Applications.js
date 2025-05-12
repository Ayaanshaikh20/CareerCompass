const { Router } = require("express");
const mongoose = require("mongoose");
const { verifyAccessToken } = require("../config/validateToken");
const router = Router();

const AppliedJob = mongoose.models.Appliedjob;

const fetchApplication = async (req, res, next) => {
  const { userId } = req.params;
  const result = await AppliedJob.find({ userId });
  res.locals.applications = result;
  next();
};

router.get(
  "/api/applications/:userId",
  verifyAccessToken,
  fetchApplication,
  async (req, res) => {
    const { applications } = res.locals;
    res.status(200).json({
      status: 200,
      message: "Fetched successfully",
      applications,
    });
  }
);

module.exports = router;
