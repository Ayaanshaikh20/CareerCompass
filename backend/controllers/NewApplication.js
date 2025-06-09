const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const dbConnect = require("../config/dbConnect");

// Controller
const createApplication = async (req, res, next) => {
  try {
    //dbConnect
    const db = await dbConnect();
    const appliedjobs = db.collection("appliedjobs");

    const applicationData = req.body;
    const newApplication = appliedjobs.insertOne(applicationData);
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
router.post("/api/new-application", verifyAccessToken, createApplication, async (req, res) => {
  const { newApplication } = res.locals;
  res.status(201).json({
    status: 201,
    message: "New application created",
    newApplication,
  });
});

module.exports = router;
