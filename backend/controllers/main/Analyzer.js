const { Router } = require("express");
const {
  extractContent,
  analyzeResume,
  validateSubscription,
  validateLimit,
  activateFreeTrial,
  saveAnalysis,
  incrementAnalysisCount,
  fetchAnalyses,
  deleteAnalysis,
} = require("../../models/main/Analyzer");
const router = Router();

router.post("/api/activate-free-trial", activateFreeTrial, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Free trial activated successfully",
  });
});

router.post(
  "/api/analyze-resume",
  validateSubscription,
  validateLimit,
  extractContent,
  analyzeResume,
  saveAnalysis,
  incrementAnalysisCount,
  async (req, res) => {
    const { analysisResult } = res.locals;
    res.status(200).json({
      status: 200,
      message: "Resume analyzed successfully",
      data: analysisResult,
    });
  },
);

router.get("/api/resume-analyses", fetchAnalyses, async (req, res) => {
  const { analyses } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Fetched resume analyses successfully",
    data: analyses,
  });
});

router.delete("/api/delete-analysis", deleteAnalysis, async (req, res) => {
  res.status(200).json({
    status: 200,
    message: "Deleted resume analysis successfully",
  });
});

module.exports = router;

