import { Request, Response } from "express";
import { ResumeService } from "../services/resume.service";

const resumeService = new ResumeService();

type AuthenticatedRequest = Request<{
  id?: string;
}> & {
  user?: {
    userId: string;
    email: string;
  };
};

export const createResume = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const {
      title,
      summary,
      skills,
      template,
      education,
      experience,
      projects,
    } = req.body;

    const resume = await resumeService.createResume(
      req.user!.userId,
      title,
      summary,
      skills,
      template,
      education,
      experience,
      projects
    );

    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message,
    });
  }
};

export const getAllResumes = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const resumes = await resumeService.getAllResumes(
    req.user!.userId
  );

  res.json(resumes);
};

export const getResume = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const resume = await resumeService.getResumeById(
    req.params.id!,
    req.user!.userId
  );

  if (!resume) {
    return res.status(404).json({
      message: "Resume not found",
    });
  }

  res.json(resume);
};

export const updateResume = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const resume = await resumeService.updateResume(
      req.params.id!,
      req.user!.userId,
      req.body
    );

    res.json(resume);
  } catch (error) {
    res.status(404).json({
      message: (error as Error).message,
    });
  }
};

export const deleteResume = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const result = await resumeService.deleteResume(
      req.params.id!,
      req.user!.userId
    );

    res.json(result);
  } catch (error) {
    res.status(404).json({
      message: (error as Error).message,
    });
  }
};
