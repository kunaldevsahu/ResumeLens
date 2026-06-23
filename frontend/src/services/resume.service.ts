import api from "@/lib/api";

export interface Resume {
  id: string;
  title: string;
  summary?: string | null;
  skills?: string | null;
  education?: any;
  experience?: any;
  projects?: any;
  template?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumePayload {
  title: string;
  summary?: string;
  skills?: string;
  education?: any;
  experience?: any;
  projects?: any;
  template?: string;
}

export interface UpdateResumePayload {
  title?: string;
  summary?: string;
  skills?: string;
  education?: any;
  experience?: any;
  projects?: any;
  template?: string;
}

export const getResumes = async (): Promise<Resume[]> => {
  const response = await api.get("/resumes");

  return response.data;
};

export const createResume = async (
  data: ResumePayload
): Promise<Resume> => {
  const response = await api.post("/resumes", data);

  return response.data;
};

export const getResumeById = async (
  id: string
): Promise<Resume> => {
  const response = await api.get(`/resumes/${id}`);

  return response.data;
};

export const updateResume = async (
  id: string,
  data: UpdateResumePayload
): Promise<Resume> => {
  const response = await api.put(`/resumes/${id}`, data);

  return response.data;
};

export const deleteResume = async (
  id: string
): Promise<{ message: string }> => {
  const response = await api.delete(`/resumes/${id}`);

  return response.data;
};