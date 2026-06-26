import { Request, Response } from "express";
import { AtsService } from "../services/ats.service";

const atsService = new AtsService();

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
  };
};

export const analyzeResume = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { resumeId, resumeTitle, resumeContent, jobDescription } = req.body;

    if (!jobDescription) {
      return res.status(400).json({
        message: "Job description is required for analysis",
      });
    }

    const report = await atsService.analyzeResume(userId, {
      resumeId,
      resumeTitle,
      resumeContent,
      jobDescription,
    });

    return res.status(201).json(report);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to run ATS analysis",
      error: (error as Error).message,
    });
  }
};

export const getHistory = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const history = await atsService.getHistory(userId);
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch ATS history",
      error: (error as Error).message,
    });
  }
};

export const getReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const reportId = req.params.id as string;

    const report = await atsService.getReportById(userId, reportId);

    if (!report) {
      return res.status(404).json({
        message: "ATS report not found",
      });
    }

    return res.status(200).json(report);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch ATS report",
      error: (error as Error).message,
    });
  }
};
