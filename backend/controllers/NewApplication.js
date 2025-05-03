const { Router } = require("express");
const router = Router();
const {
  verifyAccessToken,
} = require("../config/validateToken");
const mongoose = require("mongoose");

router.post("/api/new-application", verifyAccessToken, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "New application created",
  });
});

module.exports = router;
