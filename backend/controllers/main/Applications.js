const { Router } = require("express");
const { dbClient, getTableName } = require("../../config/dbConnect");
const { ScanCommand, PutCommand, DeleteCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const router = Router();

const fetchApplication = async (req, res, next) => {
  try {
    const { user_id } = req.query;

    const result = await dbClient.send(
      new ScanCommand({
        TableName: getTableName("applications"),
        FilterExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":user_id": user_id,
        },
      }),
    );

    if (!result.Items || result.Items.length === 0) {
      return res.status(200).json({
        status: 200,
        message: "No applications",
        applications: [],
      });
    }

    let newArr = result.Items.map((item) => ({
      id: item.application_id,
      user_id: item.user_id,
      status: item.status,
      jobLink: item.job_link,
      role: item.role,
      experience: item.experience,
      platform: item.platform,
      appliedDate: item.applied_date,
      interviewDate: item.interview_date,
      jobDescription: item.job_description,
      employer: item.employer,
      package: item.package,
      location: item.location,
    }));

    res.locals.applications = newArr;

    next();
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error fetching applications" });
  }
};

const deleteApplication = async (req, res, next) => {
  try {
    const { user_id, application_id } = req.query;

    await dbClient.send(
      new DeleteCommand({
        TableName: getTableName("applications"),
        Key: {
          user_id: user_id,
          application_id: application_id,
        },
      }),
    );
    next();
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Error deleting application" });
  }
};


const editApplication = async (req, res, next) => {
  try {
    const {
      user_id,
      id,
      role,
      appliedDate,
      package,
      employer,
      location,
      jobLink,
      experience,
      platform,
      jobDescription,
      status,
      interviewDate,
    } = req.body;

    await dbClient.send(
      new UpdateCommand({
        TableName: getTableName("applications"),
        Key: {
          user_id: user_id,
          application_id: id,
        },
        UpdateExpression: `
          SET
          #role = :role,
          applied_date = :appliedDate,
          #pkg = :package,
          employer = :employer,
          #location = :location,
          job_link = :jobLink,
          interview_date = :interviewDate,
          experience = :experience,
          platform = :platform,
          job_description = :jobDescription,
          #status = :status
        `,
        ExpressionAttributeNames: {
          "#role": "role",
          "#status": "status",
          "#pkg": "package",
          "#location": "location",
        },
        ExpressionAttributeValues: {
          ":role": role,
          ":appliedDate": appliedDate,
          ":package": package,
          ":employer": employer,
          ":location": location,
          ":jobLink": jobLink,
          ":interviewDate": interviewDate,
          ":experience": experience,
          ":platform": platform,
          ":jobDescription": jobDescription,
          ":status": status,
        },
      })
    );

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error updating application",
    });
  }
};

const createApplication = async (req, res, next) => {
  try {
    const applicationData = req.body;

    const {
      userId: user_id,
      role,
      appliedDate: applied_date,
      interviewDate: interview_date,
      package,
      employer,
      location,
      jobLink: job_link,
      experience,
      platform,
      jobDescription: job_description,
      status,
    } = applicationData;

    const result = await dbClient.send(
      new PutCommand({
        TableName: getTableName("applications"),
        Item: {
          application_id: String(Math.floor(Math.random() * 1000000)),
          user_id,
          status,
          job_link,
          role,
          experience,
          platform,
          applied_date,
          interview_date,
          job_description,
          employer,
          package,
          location,
        },
      }),
    );

    if (result) {
      next();
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error creating new application",
    });
  }
};

router.post("/api/new-application", createApplication, async (req, res) => {
  const { newApplication } = res.locals;
  res.status(201).json({
    status: 201,
    message: "New application created",
    newApplication,
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
