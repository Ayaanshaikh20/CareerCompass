const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../config/generateTokens");
const { dbClient, getTableName } = require("../../config/dbConnect");
const { QueryCommand } = require("@aws-sdk/lib-dynamodb");

const validateUser = async (req, res, next) => {
  try {
    const { email: userEmail, password: reqPass } = req.body;

    const result = await dbClient.send(
      new QueryCommand({
        TableName: getTableName("register_users"),
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": userEmail,
        },
      }),
    );

    if (result.Items && result.Items.length === 0) {
      return res.status(401).json({
        message: "Email does not exist",
        status: 401,
      });
    }

    const { user_id, first_name, location, phone_number, email, password } = result.Items[0];

    const isMatch = await bcrypt.compare(reqPass, password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        status: 401,
      });
    }

    const userObject = {
      userId: user_id,
      firstName: first_name,
      location: location,
      phone: phone_number,
      email,
    };

    await generateAccessToken(user_id, res);

    await generateRefreshToken(user_id, res);

    res.locals.userData = userObject;

    next();
  } catch (error) {
    res.status(500).json({
      message: "Error validating user",
      mainError: error.message,
      status: 500,
    });
  }
};

router.post("/api/login", validateUser, async (req, res) => {
  const { userData } = res.locals;
  res.status(200).json({
    message: "Login success",
    status: 200,
    userData,
  });
});

module.exports = router;
