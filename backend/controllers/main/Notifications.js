const { Router } = require("express");
const { getNotification } = require("../../models/main/Notifications");
const router = Router();

router.get("/api/notifications", getNotification, async (req, res) => {
  try {
    const { notifications } = res.locals;
    res.status(200).json({ status: 200, notifications });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching notifications" });
  }
});

module.exports = router;
