import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";

const paymentService = new PaymentService();

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
  };
};

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const orderData = await paymentService.createOrder(userId);
    return res.status(201).json(orderData);
  } catch (error) {
    return res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const verifyPayment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    // Extracted and verified by the verifyPaymentSignature middleware
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body.verifiedPayment;
    
    const result = await paymentService.verifyPayment(
      userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const getSubscription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const subscriptionData = await paymentService.getSubscription(userId);
    return res.status(200).json(subscriptionData);
  } catch (error) {
    return res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const cancelSubscription = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const result = await paymentService.cancelSubscription(userId);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: (error as Error).message,
    });
  }
};
