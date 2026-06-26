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
import { useAuthStore } from "@/store/auth.store";
import UpgradeModal from "@/components/ui/UpgradeModal";

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
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    const checkLimit = async () => {
      try {
        const profile = await fetchUser();
        if (profile.plan === "basic" && profile.resumeCount >= 10) {
          setShowUpgradeModal(true);
        }
      } catch (err) {
        console.error("Failed to check resume limits on mount:", err);
      }
    };
    checkLimit();
  }, [fetchUser]);

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
    if (user && user.plan === "basic" && user.resumeCount >= 10) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setSaveStatus("Saving...");
      const createdResume = await createResume(resumeStateToPayload(resume));
      setSaveStatus("Saved");
      await fetchUser().catch(console.error); // refresh count
      router.push(`/resumes/${createdResume.id}/edit`);
    } catch (error) {
      console.error("Failed to create resume", error);
      setSaveStatus("Error Saving");
    }
  };

  const handleCloseModal = () => {
    setShowUpgradeModal(false);
    router.push("/dashboard");
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

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={handleCloseModal}
      />
    </ProtectedRoute>
  );
}

