const Razorpay = require("razorpay");
const crypto = require("crypto");
const { dbClient, getTableName } = require("../../config/dbConnect");
const { UpdateCommand } = require("@aws-sdk/lib-dynamodb");

// Prices in Paise (INR)
const PLAN_DETAILS = {
  PRO: { amount: 500, name: "PRO" }, // ₹5
  PREMIUM: { amount: 1000, name: "PREMIUM" }, // ₹10
};

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
  });
};

// Create Razorpay Order
const createRazorpayOrder = async (req, res, next) => {
  try {
    const { planName } = req.body;
    const { userId } = req;

    const plan = PLAN_DETAILS[planName];
    if (!plan) {
      return res.status(400).json({ status: 400, message: "Invalid plan selected" });
    }

    const razorpay = getRazorpayInstance();
    const options = {
      amount: plan.amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        planName,
      },
    };

    const order = await razorpay.orders.create(options);

    res.locals.orderData = {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
      planName,
    };

    next();
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ status: 500, message: "Error initiating payment", error: error.message });
  }
};

// Verify Razorpay Payment Signature and Update User Plan
const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planName } = req.body;
    const { userId } = req;

    const keySecret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ status: 400, message: "Payment verification failed: Invalid signature" });
    }

    // Signature matches -> Update user plan in DynamoDB
    await dbClient.send(
      new UpdateCommand({
        TableName: getTableName("register_users"),
        Key: { user_id: userId },
        UpdateExpression: "SET #plan = :plan",
        ExpressionAttributeNames: {
          "#plan": "plan",
        },
        ExpressionAttributeValues: {
          ":plan": planName,
        },
      })
    );

    res.locals.verificationResult = {
      success: true,
      plan: planName,
    };

    next();
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ status: 500, message: "Error verifying payment signature" });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
