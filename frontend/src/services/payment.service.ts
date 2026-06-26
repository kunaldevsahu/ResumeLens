import api from "@/lib/api";

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface VerifyPaymentPayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  message: string;
  plan: string;
}

export interface SubscriptionResponse {
  plan: string;
  subscriptionStatus: string;
  startDate: string | null;
  endDate: string | null;
  resumeCount: number;
  usageLimit: string | number;
}

export const createOrder = async (): Promise<CreateOrderResponse> => {
  const response = await api.post("/payment/create-order");
  return response.data;
};

export const verifyPayment = async (
  payload: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> => {
  const response = await api.post("/payment/verify", payload);
  return response.data;
};

export const getSubscription = async (): Promise<SubscriptionResponse> => {
  const response = await api.get("/payment/subscription");
  return response.data;
};

export const cancelSubscription = async (): Promise<{ message: string }> => {
  const response = await api.post("/payment/cancel");
  return response.data;
};
