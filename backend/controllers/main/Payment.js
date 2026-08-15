const { Router } = require("express");
const { createRazorpayOrder, verifyRazorpayPayment } = require("../../models/main/Payment");
const router = Router();

router.post("/api/create-payment-order", createRazorpayOrder, async (req, res) => {
  const { orderData } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Payment order created successfully",
    orderData,
  });
});

router.post("/api/verify-payment", verifyRazorpayPayment, async (req, res) => {
  const { verificationResult } = res.locals;
  res.status(200).json({
    status: 200,
    message: "Payment verified successfully",
    verificationResult,
  });
});

module.exports = router;
