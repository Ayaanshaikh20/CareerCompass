const { Router } = require("express");
const router = Router();
const { verifyAccessToken } = require("../config/generateTokens");
const pool = require("../config/dbConnect");

const updateProfile = async (req, res, next) => {
    try {
        
    } catch (error) {
        
    }
};

router.post("/api/edit-profile", updateProfile, async (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Profile updated successfully",
    });
});