"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ResumeBuilderWorkspace, {
  defaultResumeBuilderState,
  resumeStateToPayload,
  type ResumeBuilderState,
} from "@/components/resumes/ResumeBuilderWorkspace";
import { createResume } from "@/services/resume.service";

export default function CreateResumePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#111415] text-[#bfc7d4]">
          Loading builder...
        </div>
      }
    >
      <CreateResumeBuilder />
    </Suspense>
  );
}

function CreateResumeBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const [resume, setResume] = useState<ResumeBuilderState>(
    defaultResumeBuilderState
  );
  const [saveStatus, setSaveStatus] = useState<
    "Unsaved" | "Saved" | "Saving..." | "Error Saving"
  >("Unsaved");

  useEffect(() => {
    if (templateParam) {
      setResume((current) => ({
        ...current,
        template: templateParam,
      }));
    }
  }, [templateParam]);

  const handleChange = (nextResume: ResumeBuilderState) => {
    setResume(nextResume);
    setSaveStatus("Unsaved");
  };

  const handleCreate = async () => {
    try {
      setSaveStatus("Saving...");
      const createdResume = await createResume(resumeStateToPayload(resume));
      setSaveStatus("Saved");
      router.push(`/resumes/${createdResume.id}/edit`);
    } catch (error) {
      console.error("Failed to create resume", error);
      setSaveStatus("Error Saving");
    }
  };

  return (
    <ProtectedRoute>
      <ResumeBuilderWorkspace
        mode="create"
        value={resume}
        saveStatus={saveStatus}
        primaryActionLabel="Create Resume"
        onChange={handleChange}
        onSave={handleCreate}
      />
    </ProtectedRoute>
  );
}
