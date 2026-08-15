const serverless = require("serverless-http");
const app = require("./server");
const { dbClient, getTableName } = require("./config/dbConnect");
const { ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const expressHandler = serverless(app);

const runMonthlyReset = async () => {
  console.log("Running monthly reset cron job...");
  try {
    const tableName = getTableName("register_users");
    let lastEvaluatedKey = null;

    do {
      const scanParams = {
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
      };

      const result = await dbClient.send(new ScanCommand(scanParams));

      for (const user of result.Items || []) {
        if (user.analyses_used === 0) continue;

        await dbClient.send(
          new UpdateCommand({
            TableName: tableName,
            Key: { user_id: user.user_id },
            UpdateExpression: "SET analyses_used = :zero",
            ExpressionAttributeValues: {
              ":zero": 0,
            },
          })
        );
      }

      lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    console.log("Successfully reset monthly limits for all users.");
    return { statusCode: 200, body: "Reset complete." };
  } catch (error) {
    console.error("Error running monthly reset:", error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // Check if this event came from AWS EventBridge Scheduler
  if (event.source === "aws.scheduler" || event.source === "aws.events" || event["detail-type"] === "Scheduled Event") {
    console.log("EventBridge Cron Trigger Detected!");
    return await runMonthlyReset();
  }

  // Otherwise, it's a normal HTTP API request. Pass it to Express!
  return expressHandler(event, context);
};