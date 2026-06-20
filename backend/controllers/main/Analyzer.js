const { Router } = require("express");
const { extractContent, analyzeResume } = require("../../models/main/Analyzer");
const router = Router();



router.post("/api/analyze", extractContent, analyzeResume, async (req, res) => {
    
})