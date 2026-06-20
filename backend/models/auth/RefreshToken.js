const { dbClient, getTableName } = require("../../config/dbConnect");
const { generateAccessToken } = require("../../config/generateTokens");
const jwt = require("jsonwebtoken");
const { QueryCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const generateRefreshToken = async (req, res, next) => {
  try {
    const { r_t: refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json({
          message: "Refresh token missing",
          code: "REFRESH_TOKEN_MISSING",
        });
    }

    // Verify refresh token
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        },
      );
    });

    const { id } = decoded;

    const result = await dbClient.send(
      new ScanCommand({
        TableName: getTableName("register_users"),
        FilterExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":user_id": id,
        },
      }),
    );

    if (result.Items.length === 0) {
      return res
        .status(404)
        .json({ message: "User not found", code: "USER_NOT_FOUND" });
    }

    // Generate new access token
    generateAccessToken(id, res);

    res.locals.id = id;
    next();
    
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({
          message: "Refresh token expired",
          code: "REFRESH_TOKEN_EXPIRED",
        });
    }
    if (error.name === "JsonWebTokenError") {
      return res
        .status(403)
        .json({
          message: "Invalid refresh token",
          code: "INVALID_REFRESH_TOKEN",
        });
    }
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

module.exports = { generateRefreshToken };
