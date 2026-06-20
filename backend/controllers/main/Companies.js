const { Router } = require("express");
const { fetchCompanies, createCompany, updateCompany, deleteCompany } = require("../../models/main/Companies");
const router = Router();

router.get("/api/companies", fetchCompanies, async (req, res) => {
  try {
    const companies = res.locals.companies;
    res.status(200).json({
      status: 200,
      message: "Companies fetched successfully",
      companies,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error fetching companies" });
  }
});

router.post("/api/companies", createCompany, async (req, res) => {
  try {
    res.status(201).json({
      status: 201,
      message: "Company added successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error adding company" });
  }
});

router.put("/api/companies/:id", updateCompany, async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: "Company updated successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error updating company" });
  }
});

router.delete("/api/companies/:id", deleteCompany, async (req, res) => {
  try {
    res.status(200).json({
      status: 200,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error deleting company" });
  }
});

module.exports = router;
