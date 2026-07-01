const { Router } = require("express");
const router = Router();
const { forgotPassword, limiterMiddleware } = require("../../models/auth/ForgetPassword")

router.post(
  "/api/forget-password",
  limiterMiddleware,
  forgotPassword,
  async (req, res) => {
    res.status(200).json({
      status: 200,
      message: "Reset link has been sent to the registered email",
    });
  },
);

module.exports = router;
