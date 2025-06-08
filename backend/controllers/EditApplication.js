const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const mongoose = require("mongoose");

const AppliedJob = mongoose.models.Appliedjob;

const editApplication = async (req, res, next) => {
    try {
        const { _id } = req.body;
        const application = await AppliedJob.findByIdAndUpdate(_id, req.body, {
            new: true,
        });
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
router.post(
    "/api/edit-application",
    verifyAccessToken,
    editApplication,
    async (req, res) => {
        res.status(200).json({
            status: 200,
            message: "Application updated successfully",
        });
    }
);

module.exports = router;