const { Router } = require("express");
const { dbClient, getTableName } = require("../../config/dbConnect");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const router = Router();

router.get("/api/notifications", async (req, res) => {
  try {
    const { user_id } = req.query;

    const result = await dbClient.send(
      new ScanCommand({
        TableName: getTableName("applications"),
        FilterExpression: "user_id = :userId AND attribute_exists(interview_date) AND #status <> :rejected",
        ExpressionAttributeNames: {
          "#status": "status",
        },
        ExpressionAttributeValues: {
          ":userId": user_id,
          ":rejected": "rejected",
        },
      })
    );

    const now = new Date();
    const notifications = result.Items
      .map(app => {
        const interviewDate = new Date(app.interview_date);
        const daysLeft = Math.ceil((interviewDate - now) / (1000 * 60 * 60 * 24));
        
        if (daysLeft >= 0 && daysLeft <= 5) {
          return {
            id: app.application_id,
            role: app.role,
            employer: app.employer,
            interviewDate: app.interview_date,
            daysLeft,
            message: daysLeft === 0 
              ? "Interview today!" 
              : daysLeft === 1 
              ? "Interview tomorrow!" 
              : `Interview in ${daysLeft} days`
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    res.status(200).json({ status: 200, notifications });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error fetching notifications" });
  }
});

module.exports = router;
