import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  getSubscription,
  cancelSubscription,
} from "../controllers/payment.controller";
import { authenticate } from "../middleware/auth.middleware";
import { verifyPaymentSignature } from "../middleware/verifyPayment";

const router = Router();

// All payment routes require JWT authentication
router.use(authenticate);

router.post("/create-order", createOrder);
router.post("/verify", verifyPaymentSignature, verifyPayment);
router.get("/subscription", getSubscription);
router.post("/cancel", cancelSubscription);

export default router;
