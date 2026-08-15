const serverless = require("serverless-http");
const app = require("./server");
const { dbClient, getTableName } = require("./config/dbConnect");
const { ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

exports.handler = serverless(app);

// Lambda function triggered by AWS EventBridge every month
exports.monthlyResetHandler = async (event) => {
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

      // Reset analyses_used for each user
      for (const user of result.Items || []) {
        // Skip users that already have 0 to save write capacity
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