const { Router } = require("express");
const { fetchUser, updateProfile } = require("../../models/main/User");
const router = Router();

router.get("/api/fetch-user", fetchUser, async (req, res) => {
    const { userDetails } = res.locals;
    res.status(200).json({
        status: 200,
        message: "User details fetched successfully",
        userDetails
    });
});

router.post("/api/edit-profile", updateProfile, async (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Profile updated successfully",
    });
});

module.exports = router;