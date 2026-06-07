const { Router } = require("express");
const router = Router();
const { dbClient, getTableName } = require("../../config/dbConnect");
const { UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const updateProfile = async (req, res, next) => {
    try {
        const { firstName, location, phone, email, userId } = req.body;

        await dbClient.send(
            new UpdateCommand({
                TableName: getTableName("register_users"),
                Key: { user_id: userId },
                UpdateExpression: "SET first_name = :firstName, #location = :location, phone_number = :phone, email = :email",
                ExpressionAttributeNames: {
                    "#location": "location",
                },
                ExpressionAttributeValues: {
                    ":firstName": firstName,
                    ":location": location,
                    ":phone": phone,
                    ":email": email,
                },
            })
        );

        next();
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error updating profile" });
    }
};

const fetchUser = async (req, res, next) => {
    try {
        const { userId } = req.query;

        const result = await dbClient.send(
            new GetCommand({
                TableName: getTableName("register_users"),
                Key: { user_id: userId },
            })
        );

        if (result.Item) {
            res.locals.userDetails = {
                firstName: result.Item.first_name,
                location: result.Item.location,
                phone: result.Item.phone_number,
                email: result.Item.email,
                userId: result.Item.user_id,
            };
        }

        next();
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching user" });
    }
};

router.get("/api/fetch-user", fetchUser, async (req, res) => {
    const { userDetails } = res.locals;
    res.status(200).json({
        status: 200,
        message: "User details fetched successfully",
        userDetails
    });
});

router.post("/api/edit-profile", updateProfile, async (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Profile updated successfully",
    });
});

module.exports = router;