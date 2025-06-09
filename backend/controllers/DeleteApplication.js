const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const dbConnect = require("../config/dbConnect");
const { ObjectId } = require("mongodb");

const deleteApplication = async (req, res, next) => {
  //dbConnect
  const db = await dbConnect();
  const appliedjobs = db.collection("appliedjobs");

  const { _id } = req.query;
  const deleted = await appliedjobs.findOneAndDelete({ _id: ObjectId.createFromHexString(_id) });
  if (!deleted) {
    return res.status(404).json({ status: 404, message: "Application not found" });
  }
  next();
};

router.delete("/api/delete-application", verifyAccessToken, deleteApplication, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application deleted successfully",
  });
});

module.exports = router;
