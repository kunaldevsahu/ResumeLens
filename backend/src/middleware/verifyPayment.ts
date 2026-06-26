import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const verifyPaymentSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const razorpayOrderId = req.body.razorpayOrderId || req.body.razorpay_order_id;
    const razorpayPaymentId = req.body.razorpayPaymentId || req.body.razorpay_payment_id;
    const razorpaySignature = req.body.razorpaySignature || req.body.razorpay_signature;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        message: "Missing required payment verification fields (razorpayOrderId, razorpayPaymentId, razorpaySignature)",
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      console.error("RAZORPAY_KEY_SECRET is not configured on the server.");
      return res.status(500).json({
        message: "Server configuration error: payment secret is missing",
      });
    }

    const text = razorpayOrderId + "|" + razorpayPaymentId;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        message: "Invalid payment signature. Verification failed.",
      });
    }

    // Attach verified payment info to the request for the controller
    req.body.verifiedPayment = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error during payment verification",
      error: (error as Error).message,
    });
  }
};
