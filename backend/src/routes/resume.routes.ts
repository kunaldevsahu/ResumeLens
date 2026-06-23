import { Router } from "express";
import {
  createResume,
  getAllResumes,
  getResume,
  updateResume,
  deleteResume,
} from "../controllers/resume.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.post("/", createResume);
router.get("/", getAllResumes);
router.get("/:id", getResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

export default router;