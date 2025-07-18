const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const dbConnect = require("../config/dbConnect");
const { ObjectId } = require("mongodb");

const editApplication = async (req, res, next) => {
  try {
    //dbConnect
    const db = await dbConnect();
    const appliedjobs = db.collection("appliedjobs");
    const { _id, userId, role, appliedDate, package, employer, location, jobLink, experience, platform, jobDescription, status } = req.body;
    const application = await appliedjobs.findOneAndUpdate(
      { _id: ObjectId.createFromHexString(_id) },
      {
        $set: {
          userId,
          role,
          appliedDate,
          package,
          employer,
          location,
          jobLink,
          experience,
          platform,
          jobDescription,
          status
        }
      }
    );
    if (!application) {
      return res.status(404).json({
        status: 404,
        message: "Application not found",
      });
    }
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
router.post("/api/edit-application", verifyAccessToken, editApplication, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application updated successfully",
  });
});

module.exports = router;
