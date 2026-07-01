const { Router } = require("express");
const {
  createApplication,
  editApplication,
  fetchApplication,
  deleteApplication,
} = require("../../models/main/Applications");
const router = Router();

router.post("/api/new-application", createApplication, async (req, res) => {
  res.status(201).json({
    status: 201,
    message: "New application created",
  });
});

router.post("/api/edit-application", editApplication, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Application updated successfully",
  });
});

router.delete(
  "/api/delete-application",
  deleteApplication,
  async (req, res) => {
    res.status(200).json({
      status: 200,
      message: "Application deleted successfully",
    });
  },
);

router.get("/api/applications", fetchApplication, async (req, res) => {
  const { applications } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Fetched successfully",
    applications,
  });
});

module.exports = router;
