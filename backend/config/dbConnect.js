const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const config = require("./env");

const isProd = config.env === "production";

// DynamoDB configuration based on environment
const dynamoConfig = isProd
  ? {
      region: process.env.AWS_REGION || "ap-south-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    }
  : {
      region: "ap-south-1",
      endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:5000",
      credentials: {
        accessKeyId: "local",
        secretAccessKey: "local",
      },
    };

const client = new DynamoDBClient(dynamoConfig);
const dbClient = DynamoDBDocumentClient.from(client);

// Table prefix for identification
const TABLE_PREFIX = "careercompass-";

// Helper function to get full table name
const getTableName = (baseName) => `${TABLE_PREFIX}${baseName}`;

module.exports = {
  dbClient,
  getTableName,
};