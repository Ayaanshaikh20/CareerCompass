const { Router } = require("express");
const { checkUserExist, storeUser } = require("../../models/auth/Register");
const router = Router();

// Register Route
router.post(
  "/api/register",
  checkUserExist,
  storeUser,
  (req, res) => {
    const { userData } = res.locals;
    res.status(201).json({
      status: 201,
      message: "User registered successfully",
      userData,
    });
  },
);

module.exports = router;
