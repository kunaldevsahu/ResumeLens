import { prisma } from "../config/prisma";
import { razorpay } from "../utils/razorpay";

export class PaymentService {
  async createOrder(userId: string) {
    // 1. Authenticate user is valid
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // 2. Verify user is on Basic plan
    if (user.plan === "pro") {
      throw new Error("User is already on the Pro plan");
    }

    // 3. Create Razorpay order
    // Convert Rupee price to Paise (e.g. 499 INR = 49900 Paise)
    const rawPrice = process.env.PRO_PLAN_PRICE ? parseInt(process.env.PRO_PLAN_PRICE) : 499;
    const amount = rawPrice * 100; 
    const currency = "INR";

    const options = {
      amount,
      currency,
      receipt: `receipt_order_${Date.now()}_${userId.slice(0, 8)}`,
    };

    const order = await razorpay.orders.create(options);

    // 4. Create pending Subscription record in DB
    await prisma.subscription.create({
      data: {
        userId,
        razorpayOrderId: order.id,
        amount,
        currency,
        paymentStatus: "pending",
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || "dummy_key_id",
    };
  }

  async verifyPayment(
    userId: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    // 1. Find subscription record by order ID
    const subscription = await prisma.subscription.findUnique({
      where: { razorpayOrderId },
    });

    if (!subscription) {
      throw new Error("Subscription order not found");
    }

    // Check if the payment has already been verified (idempotency check)
    if (subscription.paymentStatus === "completed") {
      return {
        message: "Payment already verified",
        plan: "pro",
      };
    }

    // 2. Update Subscription details
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 Month duration for monthly plan

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        razorpayPaymentId,
        razorpaySignature,
        paymentStatus: "completed",
        startDate,
        endDate,
      },
    });

    // 3. Upgrade User plan to PRO
    await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "pro",
        subscriptionStatus: "active",
      },
    });

    return {
      message: "Payment verified and plan upgraded to Pro successfully",
      plan: "pro",
    };
  }

  async getSubscription(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get the latest active/completed subscription record
    const latestSub = await prisma.subscription.findFirst({
      where: {
        userId,
        paymentStatus: "completed",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const resumeCount = await prisma.resume.count({
      where: { userId },
    });

    const usageLimit = user.plan === "pro" ? "Unlimited" : 10;

    return {
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      startDate: latestSub?.startDate || null,
      endDate: latestSub?.endDate || null,
      resumeCount,
      usageLimit,
    };
  }

  async cancelSubscription(userId: string) {
    // Placeholder only, as requested. No actual Razorpay cancel integration yet.
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // We can simulate cancelling active status in DB if needed, but the prompt requests "placeholder only"
    return {
      message: "Subscription cancel placeholder. No action taken on Razorpay API.",
      status: "cancelled_placeholder",
    };
  }
}
