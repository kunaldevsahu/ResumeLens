import { Router } from "express";
import { analyzeResume, getHistory, getReport } from "../controllers/ats.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// Secure all ATS routes
router.use(authenticate);

router.post("/analyze", analyzeResume);
router.get("/history", getHistory);
router.get("/:id", getReport);

export default router;
