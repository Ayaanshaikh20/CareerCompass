const { Router } = require("express");
const { validateUser } = require("../../models/auth/Login");
const router = Router();

router.post("/api/login", validateUser, async (req, res) => {
  const { userData } = res.locals;
  res.status(200).json({
    message: "Login success",
    status: 200,
    userData,
  });
});

module.exports = router;
