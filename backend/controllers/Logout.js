const { Router } = require("express");
const router = Router();

const logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("a_t", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.clearCookie("r_t", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    next();
  } catch (error) {
    res.status(500).json({
      message: "Error logging out user",
      status: 500,
    });
  }
};

router.post("/api/logout", logoutUser, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Logged out successfully",
  });
});

module.exports = router;
