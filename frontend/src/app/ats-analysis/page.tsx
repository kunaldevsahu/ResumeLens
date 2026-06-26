"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { getResumes, type Resume } from "@/services/resume.service";
import {
  analyzeResume,
  getAtsHistory,
  getAtsReport,
  type AtsReport,
  type AtsHistoryItem,
} from "@/services/ats.service";

import SelectResume from "@/components/ats/SelectResume";
import ResumeUploader from "@/components/ats/ResumeUploader";
import JobDescriptionForm from "@/components/ats/JobDescriptionForm";
import AnalysisLoader from "@/components/ats/AnalysisLoader";
import ATSScoreCard from "@/components/ats/ATSScoreCard";
import ScoreBreakdown from "@/components/ats/ScoreBreakdown";
import MissingKeywords from "@/components/ats/MissingKeywords";
import Strengths from "@/components/ats/Strengths";
import Suggestions from "@/components/ats/Suggestions";
import HistoryTable from "@/components/ats/HistoryTable";

type WizardState = "home" | "step1" | "step2" | "step3" | "result";

export default function AtsAnalysisPage() {
  const router = useRouter();
  
  // Wizard States
  const [wizardState, setWizardState] = useState<WizardState>("home");
  
  // Step 1: Select Resume States
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeSourceTab, setActiveSourceTab] = useState<"existing" | "upload" | "linkedin">("existing");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [uploadedResume, setUploadedResume] = useState<{ name: string; content: string } | null>(null);
  
  // Step 2: Job Description States
  const [jobDescription, setJobDescription] = useState<string>("");
  
  // Service Data States
  const [analysisResult, setAnalysisResult] = useState<AtsReport | null>(null);
  const [historyList, setHistoryList] = useState<AtsHistoryItem[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [apiError, setApiError] = useState("");

  // 1. Initial Load of Resumes and Scan History
  useEffect(() => {
    const initData = async () => {
      try {
        const resumesData = await getResumes();
        setResumes(resumesData);
        if (resumesData.length > 0) {
          setSelectedResumeId(resumesData[0].id);
        }
      } catch (err) {
        console.error("Failed to load resumes:", err);
      } finally {
        setLoadingResumes(false);
      }

      try {
        const historyData = await getAtsHistory();
        setHistoryList(historyData);
      } catch (err) {
        console.error("Failed to load ATS history:", err);
      } finally {
        setLoadingHistory(false);
      }
    };

    initData();
  }, []);

  // 2. Fetch and refresh history list
  const refreshHistory = async () => {
    try {
      const historyData = await getAtsHistory();
      setHistoryList(historyData);
    } catch (err) {
      console.error("Failed to reload history:", err);
    }
  };

  // 3. Load historical report directly
  const handleSelectReport = async (id: string) => {
    try {
      setApiError("");
      const report = await getAtsReport(id);
      setAnalysisResult(report);
      setWizardState("result");
    } catch (err: any) {
      setApiError(err?.response?.data?.message || err?.message || "Failed to load report");
    }
  };

  // 4. Trigger Analysis post to backend
  const handleStartAnalysis = async () => {
    setWizardState("step3"); // Transition to Loader screen
    setApiError("");

    try {
      const payload: {
        resumeId?: string;
        resumeTitle?: string;
        resumeContent?: string;
        jobDescription: string;
      } = {
        jobDescription,
      };

      if (activeSourceTab === "existing" && selectedResumeId) {
        payload.resumeId = selectedResumeId;
      } else if (activeSourceTab === "upload" && uploadedResume) {
        payload.resumeTitle = uploadedResume.name;
        payload.resumeContent = uploadedResume.content;
      }

      const report = await analyzeResume(payload);
      setAnalysisResult(report);
      await refreshHistory(); // Reload history list
    } catch (err: any) {
      setApiError(err?.response?.data?.message || err?.message || "Analysis execution failed");
      setWizardState("step2"); // Fallback back to form
    }
  };

  // 5. Download report as standard text file
  const handleDownloadReport = () => {
    if (!analysisResult) return;
    const reportText = `RESUMELENS ATS COMPATIBILITY REPORT
==================================
Resume: ${analysisResult.resumeTitle}
Target Role: ${analysisResult.jobTitle || "N/A"}
Overall ATS Score: ${analysisResult.overallScore}%
Date: ${new Date(analysisResult.createdAt).toLocaleDateString()}

CATEGORY BREAKDOWN
------------------
- Keyword Match: ${analysisResult.keywordScore}%
- Formatting: ${analysisResult.formattingScore}%
- Skills Match: ${analysisResult.skillsScore}%
- Experience Match: ${analysisResult.experienceScore}%
- Education Match: ${analysisResult.educationScore}%

MISSING KEYWORDS
----------------
${analysisResult.missingKeywords.join(", ") || "None"}

KEY STRENGTHS
-------------
${analysisResult.strengths.map(s => `- ${s}`).join("\n")}

RECOMMENDED IMPROVEMENTS
------------------------
${analysisResult.suggestions.map(s => `- [${s.priority} Priority] ${s.message}`).join("\n")}
`;
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ATS_Report_${analysisResult.resumeTitle.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedResumeId(resumes.length > 0 ? resumes[0].id : "");
    setUploadedResume(null);
    setJobDescription("");
    setAnalysisResult(null);
    setWizardState("home");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:pl-60">
          <Header />

          <main className="p-8 max-w-5xl w-full mx-auto space-y-8">
            {/* API Error Notification */}
            {apiError && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] p-3 rounded-lg text-xs font-['Inter'] flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{apiError}</span>
              </div>
            )}

            {/* STATE 1: Empty Home View */}
            {wizardState === "home" && (
              <div className="space-y-8">
                <div className="flex flex-col items-center justify-center p-12 text-center bg-[#1d2022] border border-[#ffffff14] rounded-2xl relative overflow-hidden max-w-xl mx-auto py-16">
                  {/* Glow Backdrop */}
                  <div className="absolute w-[260px] h-[260px] bg-[#2294f4]/5 blur-[70px] rounded-full pointer-events-none"></div>

                  <span className="material-symbols-outlined text-[64px] text-[#a0caff]/70 bg-[#a0caff]/5 p-5 rounded-2xl border border-[#a0caff]/15 mb-6">
                    analytics
                  </span>

                  <h2 className="font-['Geist'] text-2xl font-bold text-white mb-2">
                    Analyze Your Resume
                  </h2>
                  <p className="text-xs text-[#bfc7d4] max-w-sm leading-relaxed mb-8 opacity-75">
                    Compare your resume against a job description and receive an ATS compatibility report with actionable improvements.
                  </p>

                  <button
                    onClick={() => setWizardState("step1")}
                    className="bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-[0.98] px-8 py-3 rounded-lg font-['Geist'] text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                    <span>Start Analysis</span>
                  </button>
                </div>

                {/* History list inside empty state */}
                {!loadingHistory && historyList.length > 0 && (
                  <HistoryTable
                    history={historyList}
                    onSelectReport={handleSelectReport}
                  />
                )}
              </div>
            )}

            {/* STATE 2: Step 1 Selector Wizard */}
            {wizardState === "step1" && (
              <div className="bg-[#1d2022] border border-[#ffffff14] rounded-2xl p-8 space-y-6">
                <div>
                  <h2 className="font-['Geist'] text-xl font-bold text-white mb-1">
                    Step 1: Choose Resume
                  </h2>
                  <p className="text-xs text-[#bfc7d4] opacity-75">
                    Import your details from ResumeLens or upload a static file.
                  </p>
                </div>

                {/* Tabs selection (Options 1, 2, and 3) */}
                <div className="flex border-b border-[#ffffff0a] gap-2 pb-px text-xs font-['Geist'] font-bold">
                  <button
                    onClick={() => setActiveSourceTab("existing")}
                    className={`py-2.5 px-4 transition-all border-b-2 cursor-pointer ${
                      activeSourceTab === "existing"
                        ? "text-[#a0caff] border-[#2294f4]"
                        : "text-[#bfc7d4] border-transparent hover:text-white"
                    }`}
                  >
                    Use Existing Resume
                  </button>
                  <button
                    onClick={() => setActiveSourceTab("upload")}
                    className={`py-2.5 px-4 transition-all border-b-2 cursor-pointer ${
                      activeSourceTab === "upload"
                        ? "text-[#a0caff] border-[#2294f4]"
                        : "text-[#bfc7d4] border-transparent hover:text-white"
                    }`}
                  >
                    Upload Resume File
                  </button>
                  <button
                    disabled
                    className="py-2.5 px-4 border-b-2 border-transparent text-[#bfc7d4]/30 cursor-not-allowed flex items-center gap-1.5"
                  >
                    <span>Import LinkedIn</span>
                    <span className="bg-[#bfc7d4]/10 text-[#bfc7d4]/60 text-[8px] uppercase px-1.5 py-0.5 rounded">
                      Soon
                    </span>
                  </button>
                </div>

                {/* Selected Tab Content */}
                <div className="pt-2">
                  {activeSourceTab === "existing" && (
                    <SelectResume
                      resumes={resumes}
                      selectedResumeId={selectedResumeId}
                      onSelect={setSelectedResumeId}
                      onNext={() => setWizardState("step2")}
                    />
                  )}

                  {activeSourceTab === "upload" && (
                    <ResumeUploader
                      onUploadSuccess={(filename, textContent) =>
                        setUploadedResume({ name: filename, content: textContent })
                      }
                      onNext={() => setWizardState("step2")}
                    />
                  )}
                </div>
              </div>
            )}

            {/* STATE 3: Step 2 Job Description Form */}
            {wizardState === "step2" && (
              <div className="bg-[#1d2022] border border-[#ffffff14] rounded-2xl p-8 space-y-6">
                <div>
                  <h2 className="font-['Geist'] text-xl font-bold text-white mb-1">
                    Step 2: Compare against Role
                  </h2>
                  <p className="text-xs text-[#bfc7d4] opacity-75">
                    Paste technical requirements to scan for keyword density overlap.
                  </p>
                </div>

                <JobDescriptionForm
                  jobDescription={jobDescription}
                  onChange={setJobDescription}
                  onAnalyze={handleStartAnalysis}
                  onBack={() => setWizardState("step1")}
                />
              </div>
            )}

            {/* STATE 4: Loading Screen */}
            {wizardState === "step3" && (
              <AnalysisLoader onComplete={() => setWizardState("result")} />
            )}

            {/* STATE 5: Final Analytics Dashboard */}
            {wizardState === "result" && analysisResult && (
              <div className="space-y-8 animate-fade-in">
                {/* Result Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="font-['Geist'] text-2xl font-bold text-white">
                      {analysisResult.resumeTitle}
                    </h2>
                    <p className="text-xs text-[#bfc7d4] font-medium font-['Inter'] mt-0.5">
                      ATS Report for <span className="text-[#a0caff] font-semibold">{analysisResult.jobTitle || "Target Role"}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadReport}
                      className="bg-[#ffffff0d] hover:bg-[#ffffff14] border border-[#ffffff14] text-white px-4 py-2 rounded-lg text-xs font-bold font-['Geist'] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      <span>Download Report</span>
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-95 px-4 py-2 rounded-lg text-xs font-bold font-['Geist'] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">refresh</span>
                      <span>Analyze Again</span>
                    </button>
                  </div>
                </div>

                {/* Score and breakdown metrics layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-4 space-y-6">
                    <ATSScoreCard score={analysisResult.overallScore} />
                    <MissingKeywords keywords={analysisResult.missingKeywords} />
                  </div>

                  <div className="lg:col-span-8 space-y-6">
                    <ScoreBreakdown
                      keywordScore={analysisResult.keywordScore}
                      formattingScore={analysisResult.formattingScore}
                      skillsScore={analysisResult.skillsScore}
                      experienceScore={analysisResult.experienceScore}
                      educationScore={analysisResult.educationScore}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Strengths strengths={analysisResult.strengths} />
                      <Suggestions suggestions={analysisResult.suggestions} />
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="pt-6 border-t border-[#ffffff0a] flex justify-between">
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="bg-transparent border border-[#ffffff14] hover:bg-white/5 text-[#bfc7d4] hover:text-white px-6 py-2.5 rounded-lg text-xs font-bold font-['Geist'] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">dashboard</span>
                    <span>Return To Dashboard</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
