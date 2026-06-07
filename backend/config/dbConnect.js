const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const config = require("./env");

const isProd = config.env === "production";
const REGION = process.env.AWS_REGION || "ap-south-1";

const dynamoConfig = isProd
  ? {
      region: REGION,
    }
  : {
      region: REGION,
      endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:5000",
      credentials: {
        accessKeyId: "local",
        secretAccessKey: "local",
      },
    };

const client = new DynamoDBClient(dynamoConfig);

const dbClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
  },
});

const TABLE_PREFIX = "careercompass-";

const getTableName = (baseName) => `${TABLE_PREFIX}${baseName}`;

module.exports = {
  dbClient,
  getTableName,
};