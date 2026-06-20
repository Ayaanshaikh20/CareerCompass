const { Router } = require("express");
const { logoutUser } = require("../../models/auth/Logout");
const router = Router();

router.post("/api/logout", logoutUser, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Logged out successfully",
  });
});

module.exports = router;
