const { Router } = require("express");
const pool = require("../config/dbConnect");

const router = Router();

router.get("/api/companies", async (req, res) => {
  let con;
  try {
    con = await pool.connect();
    const { user_id } = req.query;

    const result = await con.query(
      `SELECT * FROM companies WHERE user_id=$1 ORDER BY created_at DESC`,
      [user_id]
    );

    const companies = result.rows.map((item) => ({
      id: item.id,
      userId: item.user_id,
      companyName: item.company_name,
      phoneNumber: item.phone_number,
      websiteUrl: item.website_url,
      hrEmail: item.hr_email,
      location: item.location,
    }));

    res.status(200).json({
      status: 200,
      message: "Companies fetched successfully",
      companies,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error fetching companies" });
  } finally {
    if (con) con.release();
  }
});

router.post("/api/companies", async (req, res) => {
  let con;
  try {
    con = await pool.connect();
    const { userId, companyName, phoneNumber, websiteUrl, hrEmail, location } = req.body;

    await con.query(
      `INSERT INTO companies(user_id, company_name, phone_number, website_url, hr_email, location) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, companyName, phoneNumber, websiteUrl, hrEmail, location]
    );

    res.status(201).json({
      status: 201,
      message: "Company added successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error adding company" });
  } finally {
    if (con) con.release();
  }
});

router.put("/api/companies/:id", async (req, res) => {
  let con;
  try {
    con = await pool.connect();
    const { id } = req.params;
    const { companyName, phoneNumber, websiteUrl, hrEmail, location } = req.body;

    await con.query(
      `UPDATE companies SET company_name=$1, phone_number=$2, website_url=$3, hr_email=$4, location=$5 
       WHERE id=$6`,
      [companyName, phoneNumber, websiteUrl, hrEmail, location, id]
    );

    res.status(200).json({
      status: 200,
      message: "Company updated successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error updating company" });
  } finally {
    if (con) con.release();
  }
});

router.delete("/api/companies/:id", async (req, res) => {
  let con;
  try {
    con = await pool.connect();
    const { id } = req.params;

    await con.query(`DELETE FROM companies WHERE id=$1`, [id]);

    res.status(200).json({
      status: 200,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error deleting company" });
  } finally {
    if (con) con.release();
  }
});

module.exports = router;
