const crypto = require("crypto");
const { Router } = require("express");
const { dbClient, getTableName } = require("../../config/dbConnect");
const expressRateLimit = require("express-rate-limit");
const config = require("../../config/env");
const {
  QueryCommand,
  GetCommand,
  DeleteCommand,
  PutCommand,
} = require("@aws-sdk/lib-dynamodb");

const router = Router();

const limiterMiddleware = expressRateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 2, // limit each IP to 2 requests per windowMs
  message: {
    status: 429,
    message: "Too many requests, please try again after 5 minutes",
  },
});

const isProd = process.env.NODE_ENV === "production";

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await dbClient.send(
      new QueryCommand({
        TableName: getTableName("register_users"),
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      }),
    );

    if (user.Items && user.Items.length === 0) {
      return res.status(404).json({
        status: 200,
        message: "Email does not exist",
      });
    }

    const { first_name, user_id, email: userEmail } = user.Items[0];

    const tokenData = await dbClient.send(
      new GetCommand({
        TableName: getTableName("forget_password"),
        Key: {
          email: userEmail,
        },
      }),
    );

    //if token already exist
    if (tokenData.Item) {
      const deleteToken = await dbClient.send(
        new DeleteCommand({
          TableName: getTableName("forget_password"),
          Key: {
            email,
          },
        }),
      );
    }

    // 1️⃣ Generate raw token
    const token = crypto.randomBytes(32).toString("hex");

    // 2️⃣ Hash token before saving
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = Date.now() + 5 * 60 * 1000;

    const resObject = {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiresAt, // 5 min
      email: email,
    };

    const result = await dbClient.send(
      new PutCommand({
        TableName: getTableName("forget_password"),
        Item: resObject,
      }),
    );

    const resetLink = `${config.frontendUrl}/reset-password?t=${token}`;

    res.locals.tokenDetails = {
      resetLink,
      username: first_name,
      userId: user_id,
    };

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

router.post(
  "/api/forget-password",
  limiterMiddleware,
  forgotPassword,
  async (req, res) => {
    const { tokenDetails } = res.locals;
    res.status(200).json({
      status: 200,
      message: "Reset link has been sent to the registered email",
      tokenDetails,
    });
  },
);

module.exports = router;
