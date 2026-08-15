const { Router } = require("express");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../config/generateTokens");

const router = Router();

router.post("/api/guest-login", async (req, res) => {
  try {
    const GUEST_USER_ID = "guest_demo_account"; // Fixed demo account ID

    const userObject = {
      userId: GUEST_USER_ID,
      firstName: "Guest",
      location: "Demo City",
      phone: "0000000000",
      email: "guest@careercompass.com",
      isGuest: true,
    };

    // Issue JWT cookies for the guest session
    generateAccessToken(GUEST_USER_ID, res);
    generateRefreshToken(GUEST_USER_ID, res);

    return res.status(200).json({
      status: 200,
      message: "Welcome to Guest Session!",
      userData: userObject,
    });
  } catch (error) {
    console.error("Guest login error:", error);
    return res
      .status(500)
      .json({ status: 500, message: "Failed to initiate guest login" });
  }
});

module.exports = router;
