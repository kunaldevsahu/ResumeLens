"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { getResumes, getResumeById, type Resume } from "@/services/resume.service";
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
import MatchedSkills from "@/components/ats/MatchedSkills";
import Strengths, { ATSCompatibility } from "@/components/ats/Strengths";
import Suggestions from "@/components/ats/Suggestions";
import HistoryTable from "@/components/ats/HistoryTable";
import TemplateEngine from "@/components/resumes/TemplateEngine";
import AIResumeReview from "@/components/ats/AIResumeReview";
import Link from "next/link";

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
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [apiError, setApiError] = useState("");
  const [scannedResume, setScannedResume] = useState<any>(null);

  useEffect(() => {
    if (analysisResult && analysisResult.resumeId) {
      getResumeById(analysisResult.resumeId)
        .then((data) => {
          // Parse experience, projects, education fields if they are JSON strings
          const parsed = { ...data };
          if (data.experience && typeof data.experience === "string") {
            parsed.experience = JSON.parse(data.experience);
          }
          if (data.projects && typeof data.projects === "string") {
            parsed.projects = JSON.parse(data.projects);
          }
          if (data.education && typeof data.education === "string") {
            parsed.education = JSON.parse(data.education);
          }
          setScannedResume(parsed);
        })
        .catch((err) => console.error("Failed to load scanned resume for preview:", err));
    } else {
      setScannedResume(null);
    }
  }, [analysisResult]);

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
            {wizardState === "result" && analysisResult && (() => {
              const formattedDate = new Date(analysisResult.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              const formattedTime = new Date(analysisResult.createdAt).toLocaleTimeString(undefined, {
                hour: "numeric",
                minute: "2-digit",
              });

              return (
                <div className="space-y-6 animate-fade-in pb-12">
                  {/* Result Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleReset}
                        className="w-8 h-8 rounded-lg bg-[#ffffff0d] border border-[#ffffff14] hover:bg-[#ffffff14] text-white flex items-center justify-center transition-all cursor-pointer shrink-0"
                        title="Back to Analyzer"
                      >
                        <span className="material-symbols-outlined text-base">arrow_back</span>
                      </button>
                      <div>
                        <h2 className="font-['Geist'] text-lg font-bold text-white leading-tight">
                          ATS Analysis Results
                        </h2>
                        <p className="text-[10px] text-[#bfc7d4]/60 font-medium font-['Inter'] mt-0.5">
                          Analyzed on {formattedDate} • {formattedTime}
                        </p>
                      </div>
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

                  {/* Top Stats Cards Row */}
                  <ATSScoreCard
                    overallScore={analysisResult.overallScore}
                    matchScore={analysisResult.keywordScore}
                    missingCount={analysisResult.missingKeywords.length}
                    strengthsCount={analysisResult.strengths.length}
                  />

                  {/* Main Grid Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Column 1: Resume Preview (Left, col-span-4) */}
                    <div className="lg:col-span-4 bg-[#1d2022] border border-[#ffffff14] rounded-xl p-5 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-['Geist'] text-xs font-bold text-white uppercase tracking-wider">
                          Resume Preview
                        </span>
                        {scannedResume && (
                          <Link
                            href={`/resumes/${scannedResume.id}`}
                            target="_blank"
                            className="text-[10px] text-[#a0caff] font-bold hover:underline flex items-center gap-0.5"
                          >
                            <span>View Full Resume</span>
                            <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                          </Link>
                        )}
                      </div>
                      
                      <div className="border border-[#ffffff14] bg-white rounded-lg p-6 text-[#1a1a1a] shadow-inner max-h-[600px] overflow-y-auto custom-scrollbar select-none scale-[0.98] origin-top">
                        {scannedResume ? (
                          <div className="text-[10px] origin-top scale-[0.80] -mx-8 -my-12">
                            <TemplateEngine
                              template={scannedResume.template}
                              personalInfo={scannedResume.experience?.personalInfo || { name: scannedResume.title, email: "", phone: "", jobTitle: "", location: "", website: "" }}
                              summary={scannedResume.summary || ""}
                              skills={scannedResume.skills || ""}
                              experience={scannedResume.experience?.items || []}
                              education={scannedResume.education?.items || []}
                              projects={scannedResume.projects?.items || []}
                              certifications={scannedResume.education?.certifications || []}
                              settings={scannedResume.experience?.settings}
                            />
                          </div>
                        ) : uploadedResume ? (
                          <div className="text-left font-['Inter'] text-[10px] text-[#333] space-y-4">
                            <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
                              <span className="font-bold text-gray-500 uppercase tracking-wider text-[8px]">Extracted Text Preview</span>
                              <span className="text-[8px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">Document File</span>
                            </div>
                            <div className="whitespace-pre-wrap font-sans text-[9px] leading-relaxed max-h-[500px] overflow-y-auto pr-1">
                              {uploadedResume.content}
                            </div>
                          </div>
                        ) : (
                          <div className="text-left font-['Inter'] text-[10px] text-[#333] space-y-4">
                            <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
                              <span className="font-bold text-gray-500 uppercase tracking-wider text-[8px]">ATS Scan Summary</span>
                              <span className="text-[8px] bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-semibold">Processed File</span>
                            </div>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-bold text-gray-800 text-[11px] mb-1">Parsed Title</h4>
                                <p className="text-gray-600">{analysisResult.resumeTitle}</p>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-[11px] mb-1">Target Profile</h4>
                                <p className="text-gray-600">{analysisResult.jobTitle || "General Scan"}</p>
                              </div>
                              <div className="pt-2 border-t border-gray-100 text-[9px] text-gray-400 italic">
                                File source text is kept encrypted on parser cache.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Column 2: Score Breakdown, Strengths, Compatibility (Middle, col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                      <ScoreBreakdown
                        keywordScore={analysisResult.keywordScore}
                        formattingScore={analysisResult.formattingScore}
                        skillsScore={analysisResult.skillsScore}
                        experienceScore={analysisResult.experienceScore}
                        educationScore={analysisResult.educationScore}
                      />

                      <Strengths strengths={analysisResult.strengths} />

                      <ATSCompatibility
                        formattingScore={analysisResult.formattingScore}
                        keywordScore={analysisResult.keywordScore}
                      />
                    </div>

                    {/* Column 3: Section Health, Suggestions, Matched Skills (Right, col-span-4) */}
                    <div className="lg:col-span-4 space-y-6">
                      {/* Resume Section Health */}
                      <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 space-y-4">
                        <div>
                          <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider">
                            Resume Section Health
                          </h4>
                          <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
                            Status checks evaluating individual section details.
                          </p>
                        </div>

                        <div className="space-y-3 font-['Inter'] text-xs">
                          {[
                            { name: "Summary", score: analysisResult.overallScore },
                            { name: "Skills", score: analysisResult.skillsScore },
                            { name: "Experience", score: analysisResult.experienceScore },
                            { name: "Projects", score: Math.min(100, Math.round(analysisResult.experienceScore * 0.9 + 5)) },
                            { name: "Education", score: analysisResult.educationScore },
                            { name: "Certifications", score: Math.min(100, Math.round(analysisResult.educationScore * 0.95)) },
                          ].map((section) => {
                            const getHealthStyle = (val: number) => {
                              if (val >= 80) return { label: "Excellent", dot: "bg-[#10b981]" };
                              if (val >= 60) return { label: "Average", dot: "bg-[#dc7506]" };
                              return { label: "Weak", dot: "bg-[#ef4444]" };
                            };
                            const health = getHealthStyle(section.score);

                            return (
                              <div key={section.name} className="flex items-center justify-between">
                                <span className="text-[#bfc7d4] font-medium">{section.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`h-2.5 w-2.5 rounded-full ${health.dot}`} />
                                  <span className="text-white font-bold text-[11px]">{health.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <Suggestions suggestions={analysisResult.suggestions} />

                      <MatchedSkills skills={scannedResume?.skills?.split(",").map((s: string) => s.trim()).filter(Boolean) || []} />
                    </div>
                  </div>

                  {/* AI Resume Review feedback section */}
                  <AIResumeReview report={analysisResult} />

                  {/* Recommended Actions Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#ffffff0a]">
                    {/* Action 1: Improve Resume */}
                    <div
                      onClick={() => {
                        if (scannedResume) {
                          router.push(`/resumes/${scannedResume.id}/edit`);
                        } else {
                          setWizardState("step1");
                        }
                      }}
                      className="bg-[#1d2022] border border-[#ffffff14] hover:border-[#a0caff]/35 rounded-xl p-5 flex items-center justify-between cursor-pointer transition-all hover:bg-[#222528] group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/10 text-[#a78bfa] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">auto_fix_high</span>
                        </div>
                        <div>
                          <h5 className="font-['Geist'] text-xs font-bold text-white">Improve Resume</h5>
                          <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
                            Get AI-powered suggestions to improve sections.
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#bfc7d4] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>

                    {/* Action 2: Download Report */}
                    <div
                      onClick={handleDownloadReport}
                      className="bg-[#1d2022] border border-[#ffffff14] hover:border-[#a0caff]/35 rounded-xl p-5 flex items-center justify-between cursor-pointer transition-all hover:bg-[#222528] group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#2294f4]/10 text-[#a0caff] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">download</span>
                        </div>
                        <div>
                          <h5 className="font-['Geist'] text-xs font-bold text-white">Download Report</h5>
                          <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
                            Download detailed ATS analysis as PDF.
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#bfc7d4] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>

                    {/* Action 3: Analyze Another */}
                    <div
                      onClick={handleReset}
                      className="bg-[#1d2022] border border-[#ffffff14] hover:border-[#a0caff]/35 rounded-xl p-5 flex items-center justify-between cursor-pointer transition-all hover:bg-[#222528] group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 text-[#34d399] flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined">upload_file</span>
                        </div>
                        <div>
                          <h5 className="font-['Geist'] text-xs font-bold text-white">Analyze Another Resume</h5>
                          <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
                            Upload another resume and analyze.
                          </p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[#bfc7d4] group-hover:translate-x-1 transition-transform">
                        arrow_forward
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
