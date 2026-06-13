const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Router } = require("express");
const { dbClient, getTableName } = require("../../config/dbConnect");
const {
  ScanCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const router = Router();

const resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword, token } = req.body;

    //Validation
    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Invalid request",
      });
    }

    //Match both passwords
    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 400,
        message: "Passwords do not match",
      });
    }

    //Hash token with sha256
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //Check and compare the hashed token and stored db token
    const tokenResult = await dbClient.send(
      new ScanCommand({
        TableName: getTableName("forget_password"),
        FilterExpression: "resetPasswordToken = :token",
        ExpressionAttributeValues: {
          ":token": hashedToken,
        },
      }),
    );
    
    console.log(tokenResult);
    //Validate and show result if invalid or expired reset token
    if (!tokenResult.Items || tokenResult.Items.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Reset token is invalid or expired",
      });
    }

    const { email, resetPasswordExpires } = tokenResult.Items[0];

    if (Date.now() > resetPasswordExpires) {
      return res.status(400).json({
        status: 400,
        message: "Reset token is invalid or expired",
      });
    }

    //hash/encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //fetch the user
    const userResult = await dbClient.send(
      new QueryCommand({
        TableName: getTableName("register_users"),
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      }),
    );

    const user = userResult.Items[0];

    //update the password in db
    await dbClient.send(
      new UpdateCommand({
        TableName: getTableName("register_users"),
        Key: {
          user_id: user.user_id,
        },
        UpdateExpression: "SET password = :password",
        ExpressionAttributeValues: {
          ":password": hashedPassword,
        },
      }),
    );

    //delete the token record once done
    await dbClient.send(
      new DeleteCommand({
        TableName: getTableName("forget_password"),
        Key: {
          email: email,
        },
      }),
    );

    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

router.post("/api/reset-password", resetPassword, async (req, res) => {
  res.status(200).json({
    status: 200,
    message:
      "Password changed successfully. Please login with your new password.",
  });
});

module.exports = router;
