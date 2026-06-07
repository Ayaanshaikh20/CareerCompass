const { Router } = require("express");
const { dbClient, getTableName } = require("../../config/dbConnect");
const {
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const router = Router();

const fetchCompanies = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const result = await dbClient.send(
      new ScanCommand({
        TableName: getTableName("companies"),
        FilterExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":user_id": user_id,
        },
      }),
    );

    const companies = result.Items.map((item) => ({
      id: item.company_id,
      userId: item.user_id,
      companyName: item.company_name,
      phoneNumber: item.phone_number,
      websiteUrl: item.website_url,
      hrEmail: item.hr_email,
      location: item.location,
      isContacted: item.is_contacted || false,
    }));

    res.locals.companies = companies;
    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error fetching companies" });
  }
};

const createCompany = async (req, res, next) => {
  try {
    const {
      userId,
      companyName,
      phoneNumber,
      websiteUrl,
      hrEmail,
      location,
      isContacted,
    } = req.body;

    const result = await dbClient.send(
      new PutCommand({
        TableName: getTableName("companies"),
        Item: {
          company_id: String(Math.floor(Math.random() * 1000000)),
          user_id: userId,
          company_name: companyName,
          phone_number: phoneNumber,
          website_url: websiteUrl,
          hr_email: hrEmail,
          location: location,
          is_contacted: isContacted,
        },
      }),
    );

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error adding company" });
  }
};

const updateCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      companyName,
      phoneNumber,
      websiteUrl,
      hrEmail,
      location,
      isContacted,
      userId,
    } = req.body;

    const result = await dbClient.send(
      new UpdateCommand({
        TableName: getTableName("companies"),
        Key: {
          user_id: userId,
          company_id: id,
        },
        UpdateExpression: `set company_name = :companyName, 
          phone_number = :phoneNumber, 
          website_url = :websiteUrl, 
          hr_email = :hrEmail, 
          #location = :location, 
          is_contacted = :isContacted`,
        ExpressionAttributeNames: {
          "#location": "location",
        },
        ExpressionAttributeValues: {
          ":companyName": companyName,
          ":phoneNumber": phoneNumber,
          ":websiteUrl": websiteUrl,
          ":hrEmail": hrEmail,
          ":location": location,
          ":isContacted": isContacted,
        },
        ReturnValues: "UPDATED_NEW",
      }),
    );
    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error updating company" });
  }
};

const deleteCompany = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    await dbClient.send(
      new DeleteCommand({
        TableName: getTableName("companies"),
        Key: {
          user_id: userId,
          company_id: id,
        },
      }),
    );

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error deleting company" });
  }
};

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
