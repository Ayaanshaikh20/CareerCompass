const { Router } = require("express");
const { generateRefreshToken } = require("../../models/auth/RefreshToken");
const router = Router();

router.post("/api/refresh-token", generateRefreshToken, async (req, res) => {
  const { id } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Access token refreshed",
    data: {
      userId: id,
    },
  });
});

module.exports = router;
