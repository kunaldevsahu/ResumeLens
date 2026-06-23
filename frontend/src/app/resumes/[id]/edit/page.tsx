"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import ResumeBuilderWorkspace, {
  defaultResumeBuilderState,
  resumeStateToPayload,
  resumeToBuilderState,
  type ResumeBuilderState,
} from "@/components/resumes/ResumeBuilderWorkspace";
import { getResumeById, updateResume } from "@/services/resume.service";

type SaveStatus = "Saved" | "Saving..." | "Error Saving";

export default function EditResumePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#111415] text-[#bfc7d4]">
          Loading builder...
        </div>
      }
    >
      <EditResumeBuilder />
    </Suspense>
  );
}

function EditResumeBuilder() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template");
  const [loading, setLoading] = useState(true);
  const [resume, setResume] = useState<ResumeBuilderState>(
    defaultResumeBuilderState
  );
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("Saved");
  const isFirstAutosave = useRef(true);

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        const data = await getResumeById(params.id);
        const nextResume = resumeToBuilderState(data);

        setResume({
          ...nextResume,
          template: templateParam || nextResume.template,
        });
        setSaveStatus("Saved");
      } catch (error) {
        console.error("Failed to load resume details", error);
        setSaveStatus("Error Saving");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      void loadResume();
    }
  }, [params.id, templateParam]);

  useEffect(() => {
    if (loading) {
      isFirstAutosave.current = true;
      return;
    }

    if (isFirstAutosave.current) {
      isFirstAutosave.current = false;
      return;
    }

    setSaveStatus("Saving...");

    const timeoutId = window.setTimeout(async () => {
      try {
        await updateResume(params.id, resumeStateToPayload(resume));
        setSaveStatus("Saved");
      } catch (error) {
        console.error("Autosave failed", error);
        setSaveStatus("Error Saving");
      }
    }, 1200);

    return () => window.clearTimeout(timeoutId);
  }, [loading, params.id, resume]);

  const handleSave = async () => {
    try {
      setSaveStatus("Saving...");
      await updateResume(params.id, resumeStateToPayload(resume));
      setSaveStatus("Saved");
    } catch (error) {
      console.error("Failed to save resume updates", error);
      setSaveStatus("Error Saving");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#111415] text-[#bfc7d4]">
        <div className="text-center">
          <span className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#a0caff] border-t-transparent" />
          <p>Loading builder...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <ResumeBuilderWorkspace
        mode="edit"
        value={resume}
        saveStatus={saveStatus}
        primaryActionLabel="Save"
        onChange={setResume}
        onSave={handleSave}
      />
    </ProtectedRoute>
  );
}
