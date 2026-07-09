"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import UpgradeModal from "@/components/ui/UpgradeModal";

// Sub-services
import { 
  getResumes, 
  getResumeById, 
  createResume, 
  deleteResume, 
  type Resume, 
  type ResumePayload 
} from "@/services/resume.service";
import { getAtsHistory, type AtsHistoryItem } from "@/services/ats.service";
import { useAuthStore } from "@/store/auth.store";

// Custom Dashboard Redesign Components
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatisticsGrid from "@/components/dashboard/StatisticsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentResumeCards from "@/components/dashboard/RecentResumeCards";
import ResumeUsageCard from "@/components/dashboard/ResumeUsageCard";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import ResumeTips from "@/components/dashboard/ResumeTips";

export default function Dashboard() {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [atsHistory, setAtsHistory] = useState<AtsHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [resumesData, historyData] = await Promise.all([
        getResumes(),
        getAtsHistory(),
        fetchUser(),
      ]);
      setResumes(resumesData);
      setAtsHistory(historyData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchUser]);

  const handleCreateResumeClick = () => {
    if (user && user.plan === "basic" && resumes.length >= 10) {
      setShowUpgradeModal(true);
    } else {
      router.push("/resumes/new");
    }
  };

  const handleDuplicateResume = async (resume: Resume) => {
    try {
      setLoading(true);
      const fullResume = await getResumeById(resume.id);
      
      const payload: ResumePayload = {
        title: `${fullResume.title} (Copy)`,
        summary: fullResume.summary || "",
        skills: fullResume.skills || "",
        experience: fullResume.experience || {},
        projects: fullResume.projects || {},
        education: fullResume.education || {},
        template: fullResume.template || "modern-ats",
      };

      await createResume(payload);
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      console.error("Failed to duplicate resume:", err);
      alert("Failed to duplicate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return;
    }
    try {
      setLoading(true);
      await deleteResume(id);
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      console.error("Failed to delete resume:", err);
      alert("Failed to delete resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const plan = user?.plan === "pro" ? "pro" : "basic";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-60">
          <DashboardHeader />

          <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
            {loading ? (
              // Loading Skeleton State
              <div className="space-y-8 animate-pulse">
                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-[#191c1e] border border-white/5 h-28 rounded-2xl" />
                  ))}
                </div>

                {/* Quick Actions Skeleton */}
                <div className="space-y-3">
                  <div className="h-5 w-28 bg-[#191c1e] rounded" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-[#191c1e] border border-white/5 h-36 rounded-2xl" />
                    ))}
                  </div>
                </div>

                {/* Main Bento Layout Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-[#191c1e] border border-white/5 h-96 rounded-2xl" />
                  <div className="lg:col-span-4 space-y-6">
                    <div className="bg-[#191c1e] border border-white/5 h-44 rounded-2xl" />
                    <div className="bg-[#191c1e] border border-white/5 h-48 rounded-2xl" />
                  </div>
                </div>
              </div>
            ) : (
              // Active Dashboard Content
              <div className="space-y-8 animate-fadeIn">
                {/* Statistics Row */}
                <StatisticsGrid
                  resumesCount={resumes.length}
                  analysesCount={atsHistory.length}
                  plan={plan}
                />

                {/* Quick Actions Bar */}
                <QuickActions
                  onCreateResumeClick={handleCreateResumeClick}
                  onAnalyzerClick={() => router.push("/ats-analysis")}
                  onTemplatesClick={() => router.push("/templates")}
                  onProfileClick={() => router.push("/profile")}
                />

                {/* 2-Column Bento grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Recent Resumes (col-span-8) */}
                  <div className="lg:col-span-8">
                    <RecentResumeCards
                      resumes={resumes}
                      onDuplicate={handleDuplicateResume}
                      onDelete={handleDeleteResume}
                    />
                  </div>

                  {/* Right Column: Usage, Timeline, Sub & Tips (col-span-4) */}
                  <div className="lg:col-span-4 space-y-6">
                    
                    {/* Resume Usage (only shown on basic tier) */}
                    {plan === "basic" && (
                      <ResumeUsageCard
                        resumesCount={resumes.length}
                        plan={plan}
                        onUpgradeClick={() => setShowUpgradeModal(true)}
                      />
                    )}

                    {/* Subscription billing tier status */}
                    <SubscriptionCard
                      plan={plan}
                      onUpgradeClick={() => setShowUpgradeModal(true)}
                    />

                    {/* Dynamic User Activity Timeline */}
                    <ActivityTimeline
                      resumes={resumes}
                      atsHistory={atsHistory}
                    />

                    {/* Quick career tips widget */}
                    <ResumeTips />

                  </div>

                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </ProtectedRoute>
  );
}