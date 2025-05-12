const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/validateToken");
const mongoose = require("mongoose");

const appliedJobSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    role: { type: String, required: true },
    appliedDate: { type: Date, required: true },
    package: { type: String, required: true },
    employer: { type: String, required: true },
    location: { type: String, required: true },
    jobLink: { type: String, default: "" },
    experience: { type: String, default: "" },
    platform: { type: String, default: "" },
    jobDescription: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const AppliedJob = mongoose.model("Appliedjob", appliedJobSchema);

// Controller
const createApplication = async (req, res, next) => {
  try {
    const applicationData = req.body;
    const newApplication = new AppliedJob(applicationData);
    await newApplication.save();
    res.locals.newApplication = newApplication;
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Route
router.post(
  "/api/new-application",
  verifyAccessToken,
  createApplication,
  async (req, res) => {
    const { newApplication } = res.locals;
    res.status(201).json({
      status: 201,
      message: "New application created",
      newApplication,
    });
  }
);

module.exports = router;
