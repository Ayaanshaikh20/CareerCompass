const { Router } = require("express");
const { resetPassword } = require("../../models/auth/ResetPassword");
const router = Router();

router.post("/api/reset-password", resetPassword, async (req, res) => {
  res.status(200).json({
    status: 200,
    message:
      "Password changed successfully. Please login with your new password.",
  });
});

module.exports = router;
