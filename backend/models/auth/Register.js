const { dbClient, getTableName } = require("../../config/dbConnect");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../config/generateTokens");
const bcrypt = require("bcrypt");
const { QueryCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");

//check user exists
const checkUserExist = async (req, res, next) => {
  try {
    // Extract email from request body
    const { email } = req.body;

    const result = await dbClient.send(
      new QueryCommand({
        TableName: getTableName("register_users"),
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      }),
    );

    if (result.Items && result.Items.length > 0) {
      return res
        .status(400)
        .json({ status: 400, message: "Email already registered" });
    }

    res.locals.userDetails = {
      ...req.body,
    };

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error registering user" });
  }
};

// Middleware: Store User in DB
const storeUser = async (req, res, next) => {
  try {
    const { email, firstName, location, password, phone } =
      res.locals.userDetails;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = randomUUID();

    const user = {
      user_id: userId,
      first_name: firstName,
      location: location,
      phone_number: phone,
      email: email,
      password: hashedPassword,
      plan: "FREE",
      analyses_used: 0,
    };

    await dbClient.send(
      new PutCommand({
        TableName: getTableName("register_users"),
        Item: user,
      }),
    );

    // Generate tokens with user_id
    await generateAccessToken(userId, res);
    await generateRefreshToken(userId, res);

    // Prepare response data
    res.locals.userData = {
      userId: userId,
      firstName: firstName,
      location: location,
      phone: phone,
      email: email,
    };

    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: "Error registering user" });
  }
};

module.exports = { checkUserExist, storeUser };
