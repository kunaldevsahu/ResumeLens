import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  updatePassword,
  upgradePlan,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authenticate, getProfile);
router.put("/profile", authenticate, updateProfile);
router.put("/password", authenticate, updatePassword);
router.post("/upgrade", authenticate, upgradePlan);

export default router;