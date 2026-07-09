import api from "@/lib/api";

export interface AtsReport {
  id: string;
  userId: string;
  resumeId?: string | null;
  resumeTitle: string;
  jobTitle?: string | null;
  jobDescription: string;
  overallScore: number;
  keywordScore: number;
  formattingScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  missingKeywords: string[];
  strengths: string[];
  suggestions: Array<{ priority: "High" | "Medium" | "Low"; message: string }>;
  aiReview?: {
    overallAssessment: string;
    strengths: string[];
    areasForImprovement: string[];
    recruiterPerspective: string;
    interviewReadiness: {
      score: number;
      explanation: string;
    };
  };
  createdAt: string;
}

export interface AtsHistoryItem {
  id: string;
  resumeTitle: string;
  jobTitle: string | null;
  overallScore: number;
  createdAt: string;
}

export const analyzeResume = async (payload: {
  resumeId?: string;
  resumeTitle?: string;
  resumeContent?: string;
  jobDescription: string;
}): Promise<AtsReport> => {
  const response = await api.post("/ats/analyze", payload);
  return response.data;
};

export const getAtsHistory = async (): Promise<AtsHistoryItem[]> => {
  const response = await api.get("/ats/history");
  return response.data;
};

export const getAtsReport = async (id: string): Promise<AtsReport> => {
  const response = await api.get(`/ats/${id}`);
  return response.data;
};
