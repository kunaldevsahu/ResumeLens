"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/navigation/Sidebar";
import Header from "@/components/navigation/Header";
import { useAuthStore } from "@/store/auth.store";
import UpgradeModal from "@/components/ui/UpgradeModal";
import { createResume } from "@/services/resume.service";

type WizardStep = "source" | "upload";

interface SourceOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  ctaText: string;
  comingSoon?: boolean;
  badge?: string;
}

const SOURCE_OPTIONS: SourceOption[] = [
  {
    id: "scratch",
    title: "Start From Scratch",
    description: "Create a brand-new resume using ResumeLens templates.",
    icon: "edit_note",
    ctaText: "Continue",
  },
  {
    id: "upload",
    title: "Upload Existing Resume",
    description: "Upload your existing PDF or DOCX resume and continue editing it inside ResumeLens.",
    icon: "upload_file",
    ctaText: "Choose File",
  },
  {
    id: "linkedin",
    title: "Import LinkedIn Profile",
    description: "Import your professional history directly from your LinkedIn profile.",
    icon: "account_circle",
    ctaText: "Coming Soon",
    comingSoon: true,
    badge: "Coming Soon",
  },
];

export default function NewResumeFlowPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#111415] text-[#bfc7d4]">
          Loading...
        </div>
      }
    >
      <ProtectedRoute>
        <NewResumeWizard />
      </ProtectedRoute>
    </Suspense>
  );
}

function NewResumeWizard() {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("source");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Auth Limit Checks
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchUser().catch(console.error);
  }, [fetchUser]);

  // Drag & Drop / Upload States
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parsingLogs, setParsingLogs] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSourceSelect = (sourceId: string, comingSoon?: boolean) => {
    if (comingSoon) return;
    setSelectedSource(sourceId);
  };

  const checkResumeLimit = () => {
    if (user && user.plan === "basic" && user.resumeCount >= 10) {
      setShowUpgradeModal(true);
      return true;
    }
    return false;
  };

  const handleContinue = () => {
    if (!selectedSource) return;
    if (checkResumeLimit()) return;
    
    if (selectedSource === "scratch") {
      // Clear previous upload sessions
      sessionStorage.removeItem("uploadedResumeData");
      router.push("/templates");
    } else if (selectedSource === "upload") {
      setStep("upload");
    }
  };

  // Drag & Drop / Browse Logic
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const validExtensions = ["pdf", "docx"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
    if (!fileExtension || !validExtensions.includes(fileExtension)) {
      setUploadError("Unsupported file format. Please upload a PDF or DOCX file.");
      setSelectedFile(null);
      return false;
    }
    
    setSelectedFile(file);
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileExtraction = async (file: File): Promise<any> => {
    const filename = file.name;
    const ext = filename.split(".").pop()?.toLowerCase();

    if (ext === "txt") {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            if (!text) {
              throw new Error("Empty file");
            }

            // Extract email
            const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            // Extract phone
            const phoneMatch = text.match(/\+?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}/);
            
            // Extract name (first non-empty line of the file)
            const lines = text.split("\n").map(l => l.trim()).filter(l => l.length > 0);
            let name = "";
            if (lines.length > 0) {
              const firstLine = lines[0];
              // Simple validation: name shouldn't have emails, numbers, or be too long
              if (firstLine.length < 50 && !firstLine.includes("@") && !/\d/.test(firstLine)) {
                name = firstLine;
              }
            }

            // Strict check: if Name or Email is missing, fail parsing!
            if (!name || !emailMatch) {
              throw new Error("Missing Name or Email in text file");
            }

            // Simple section extraction for summary/skills
            let summary = "";
            let skills = "";
            
            // Search for Summary
            const summaryIdx = lines.findIndex(l => /summary|objective|profile/i.test(l));
            if (summaryIdx !== -1 && lines.length > summaryIdx + 1) {
              summary = lines[summaryIdx + 1];
            }

            // Search for Skills
            const skillsIdx = lines.findIndex(l => /skills|expertise|technologies/i.test(l));
            if (skillsIdx !== -1 && lines.length > skillsIdx + 1) {
              skills = lines[skillsIdx + 1];
            }

            const cleanName = name;
            const email = emailMatch[0];
            const phone = phoneMatch ? phoneMatch[0] : "";
            const emailPrefix = email.split("@")[0];

            resolve({
              title: `${cleanName} Resume (Imported)`,
              summary: summary || "Experienced software professional specializing in full stack engineering.",
              skills: skills || "JavaScript, TypeScript, HTML, CSS",
              template: "modern-ats",
              experience: {
                personalInfo: {
                  name: cleanName,
                  email,
                  phone,
                  jobTitle: "Software Engineer",
                  location: "San Francisco, CA",
                  website: `${emailPrefix.replace(/\./g, "")}.dev`,
                  linkedin: `linkedin.com/in/${emailPrefix.replace(/\./g, "")}`,
                  github: `github.com/${emailPrefix.replace(/\./g, "")}`,
                },
                items: [
                  {
                    id: "exp-1",
                    company: "Apex Tech Labs",
                    role: "Software Engineer",
                    dates: "2023-01 - Present",
                    description: "Developed and maintained highly responsive microservices and web layouts."
                  }
                ],
                settings: {
                  fontSize: "md",
                  spacing: "normal",
                  sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills"],
                }
              },
              education: {
                items: [],
                certifications: []
              },
              projects: {
                items: []
              }
            });
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = () => reject(new Error("File reading error"));
        reader.readAsText(file);
      });
    } else {
      // PDF or DOCX - Filename-based parsing
      const displayName = filename.substring(0, filename.lastIndexOf(".")) || filename;
      
      let cleanName = displayName
        .replace(/[-_]resume/gi, "")
        .replace(/[-_]/g, " ")
        .trim();
      
      cleanName = cleanName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      const lowerName = cleanName.toLowerCase();
      // Strict check: if the filename name is generic, treat it as missing name!
      if (
        !cleanName ||
        lowerName === "uploaded resume" ||
        lowerName === "resume" ||
        lowerName === "cv" ||
        lowerName === "my resume" ||
        lowerName.startsWith("resume ") ||
        lowerName.endsWith(" resume")
      ) {
        throw new Error("Missing specific name in filename");
      }

      const emailPrefix = cleanName.toLowerCase().replace(/\s+/g, ".");

      return {
        title: `${displayName} (Imported)`,
        summary: "Experienced software professional specializing in full stack engineering, system architecture, and delivering responsive, user-centric SaaS products.",
        skills: "React, TypeScript, Next.js, Node.js, Express, PostgreSQL, TailwindCSS, AWS, Docker, Git",
        template: "modern-ats",
        experience: {
          personalInfo: {
            name: cleanName,
            email: `${emailPrefix}@resumelens.io`,
            phone: "+1 (555) 234-5678",
            jobTitle: "Senior Full Stack Engineer",
            location: "San Francisco, CA",
            website: `${emailPrefix.replace(/\./g, "")}.dev`,
            linkedin: `linkedin.com/in/${emailPrefix.replace(/\./g, "")}`,
            github: `github.com/${emailPrefix.replace(/\./g, "")}`,
          },
          items: [
            {
              id: "exp-1",
              company: "Apex Tech Labs",
              role: "Senior Full Stack Engineer",
              dates: "2023-01 - Present",
              description: "Developed and maintained highly responsive microservices and real-time dashboard layouts. Improved frontend build speeds by 35% using Next.js."
            },
            {
              id: "exp-2",
              company: "ByteCraft Studio",
              role: "Software Engineer II",
              dates: "2021-03 - 2022-12",
              description: "Built scalable web components and API integrations. Spearheaded migration of legacy CSS to modular Tailwind systems."
            }
          ],
          settings: {
            fontSize: "md",
            spacing: "normal",
            sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills"],
          }
        },
        education: {
          items: [
            {
              id: "edu-1",
              school: "Bay Area University",
              degree: "Bachelor of Science in Computer Science",
              dates: "2017-09 - 2021-05",
              gpa: "3.8"
            }
          ],
          certifications: [
            {
              id: "cert-1",
              name: "AWS Certified Solutions Architect",
              issuer: "Amazon Web Services",
              dates: "2024",
            }
          ]
        },
        projects: {
          items: [
            {
              id: "proj-1",
              name: "SaaS Workflow Automator",
              tech: "React, Node.js, Go",
              description: "Built an open-source workflow execution engine with real-time process monitoring."
            }
          ]
        }
      };
    }
  };

  const startMockParsing = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(0);
    setParsingLogs([]);

    try {
      // Pre-flight check: trigger parsing validation
      const parsedData = await handleFileExtraction(selectedFile);
      
      // Step 1: Uploading progress (0% - 40%)
      const uploadInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 40) {
            clearInterval(uploadInterval);
            // Add first log
            setParsingLogs((logs) => [...logs, "✨ Reading document nodes..."]);
            startParsing(parsedData);
            return 40;
          }
          return prev + 5;
        });
      }, 100);
    } catch (err) {
      console.error("Failed to parse file", err);
      setUploadError("Failed to Parse. Please try again or upload again.");
      setIsUploading(false);
    }
  };

  const startParsing = (parsedData: any) => {
    // Step 2: Parsing progress (40% - 100%)
    let currentProgress = 40;
    const interval = setInterval(() => {
      currentProgress += 10;
      setUploadProgress(currentProgress);

      if (currentProgress === 60) {
        setParsingLogs((logs) => [...logs, "👤 Extracting profile and contact details..."]);
      } else if (currentProgress === 80) {
        setParsingLogs((logs) => [...logs, "💼 Scanning work history and projects..."]);
      } else if (currentProgress === 90) {
        setParsingLogs((logs) => [...logs, "📚 Structuring education and skills..."]);
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setParsingLogs((logs) => [...logs, "✅ Data extraction complete!"]);
        setTimeout(() => {
          void proceedToBuilder(parsedData);
        }, 800);
      }
    }, 300);
  };

  const proceedToBuilder = async (parsedData: any) => {
    // Store in global sessionStorage state so the builder page can load it as the absolute source of truth
    sessionStorage.setItem("lastUploadedResumeData", JSON.stringify(parsedData));

    try {
      setParsingLogs((logs) => [...logs, "🚀 Creating resume with default template..."]);
      const newResume = await createResume(parsedData);
      
      // Refresh count
      await fetchUser().catch(console.error);
      
      setParsingLogs((logs) => [...logs, "🎉 Redirecting to editor..."]);
      setTimeout(() => {
        router.push(`/resumes/${newResume.id}/edit`);
      }, 500);
    } catch (err) {
      console.error("Failed to create resume from upload", err);
      setUploadError("Failed to Parse. Please try again or upload again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-60">
        <Header />

        <main className="p-8 max-w-5xl w-full mx-auto space-y-8 flex-1 flex flex-col justify-center">
          {step === "source" ? (
            <div className="space-y-8 py-8 animate-fade-in">
              {/* Step Header */}
              <div className="text-center space-y-2">
                <h2 className="font-['Geist'] text-3xl font-extrabold text-white tracking-tight">
                  Create a New Resume
                </h2>
                <p className="text-sm text-[#bfc7d4] opacity-75 font-['Inter'] max-w-md mx-auto">
                  Choose how you&apos;d like to get started. Select a template afterwards to refine your layout.
                </p>
              </div>

              {/* 3 Option Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SOURCE_OPTIONS.map((option) => {
                  const isSelected = selectedSource === option.id;
                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSourceSelect(option.id, option.comingSoon)}
                      className={`relative flex flex-col justify-between p-6 bg-[#1d2022]/40 border rounded-2xl cursor-pointer select-none transition-all duration-300 min-h-[220px] ${
                        option.comingSoon
                          ? "opacity-50 border-[#ffffff0a] cursor-not-allowed"
                          : isSelected
                          ? "border-[#2294f4] bg-[#2294f4]/5 shadow-[0_0_25px_rgba(34,148,244,0.15)] scale-[1.02]"
                          : "border-[#ffffff14] hover:border-[#2294f4]/40 hover:shadow-[0_0_20px_rgba(34,148,244,0.1)] hover:-translate-y-1"
                      }`}
                    >
                      {/* Checkmark Indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-[#2294f4] flex items-center justify-center animate-scale-up">
                          <span className="material-symbols-outlined fill-icon text-[24px]">
                            check_circle
                          </span>
                        </div>
                      )}

                      {/* Coming Soon Badge */}
                      {option.comingSoon && option.badge && (
                        <span className="absolute top-4 right-4 bg-[#ffffff0a] text-[#bfc7d4] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-[#ffffff14]">
                          {option.badge}
                        </span>
                      )}

                      {/* Card Content */}
                      <div className="space-y-4">
                        <span
                          className={`material-symbols-outlined text-[40px] p-2 bg-[#ffffff08] rounded-xl border border-[#ffffff14] inline-block ${
                            isSelected ? "text-[#2294f4] border-[#2294f4]/20 bg-[#2294f4]/10" : "text-[#bfc7d4]/80"
                          }`}
                        >
                          {option.icon}
                        </span>
                        <div className="space-y-1.5">
                          <h4 className="font-['Geist'] text-lg font-bold text-white">
                            {option.title}
                          </h4>
                          <p className="font-['Inter'] text-xs text-[#bfc7d4] opacity-75 leading-relaxed">
                            {option.description}
                          </p>
                        </div>
                      </div>

                      {/* CTA Button inside card */}
                      <button
                        disabled={option.comingSoon}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (option.comingSoon) return;
                          setSelectedSource(option.id);
                          if (option.id === "scratch") {
                            sessionStorage.removeItem("uploadedResumeData");
                            router.push("/templates");
                          } else if (option.id === "upload") {
                            setStep("upload");
                          }
                        }}
                        className={`mt-6 w-full py-2.5 rounded-lg font-['Geist'] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          option.comingSoon
                            ? "bg-[#ffffff05] text-[#bfc7d4]/30 border border-transparent cursor-not-allowed"
                            : isSelected
                            ? "bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-[0.98] cursor-pointer"
                            : "bg-[#ffffff08] border border-[#ffffff14] text-white hover:bg-[#ffffff14] active:scale-[0.98] cursor-pointer"
                        }`}
                      >
                        <span>{option.ctaText}</span>
                        {!option.comingSoon && (
                          <span className="material-symbols-outlined text-[14px]">
                            arrow_forward
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Global Continue Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleContinue}
                  disabled={!selectedSource}
                  className={`px-8 py-3 rounded-lg font-['Geist'] text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedSource
                      ? "bg-[#2294f4] text-[#002b4e] hover:opacity-90 shadow-lg hover:shadow-[0_0_20px_rgba(34,148,244,0.3)] active:scale-95 cursor-pointer"
                      : "bg-[#ffffff05] border border-[#ffffff14] text-[#bfc7d4]/35 cursor-not-allowed"
                  }`}
                >
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-xl mx-auto w-full space-y-6 py-8 animate-fade-in">
              {/* Back navigation */}
              <button
                onClick={() => {
                  setStep("source");
                  setSelectedFile(null);
                  setUploadError(null);
                  setIsUploading(false);
                }}
                disabled={isUploading}
                className="flex items-center gap-1.5 text-xs text-[#bfc7d4] hover:text-white transition-colors cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">
                  arrow_back
                </span>
                <span>Back to sources</span>
              </button>

              <div className="space-y-2">
                <h3 className="font-['Geist'] text-2xl font-extrabold text-white">
                  Upload existing resume
                </h3>
                <p className="text-xs text-[#bfc7d4] opacity-75 font-['Inter'] leading-relaxed">
                  Upload your file in PDF or DOCX format. ResumeLens AI will extract your education, experience, and contact details.
                </p>
              </div>

              {/* Upload Workspace Box */}
              {!isUploading ? (
                <div className="space-y-4">
                  {/* Dropzone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerBrowse}
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all bg-[#1d2022]/40 relative flex flex-col items-center justify-center cursor-pointer min-h-[260px] ${
                      dragActive
                        ? "border-[#2294f4] bg-[#2294f4]/5 shadow-[0_0_25px_rgba(34,148,244,0.1)]"
                        : "border-[#ffffff14] hover:border-[#2294f4]/40 hover:bg-[#1d2022]/60"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <span className="material-symbols-outlined text-[48px] text-[#bfc7d4]/60 bg-[#ffffff05] p-4 rounded-full border border-[#ffffff0a] mb-4">
                      cloud_upload
                    </span>

                    {selectedFile ? (
                      <div className="space-y-1 animate-scale-up">
                        <p className="text-sm font-bold text-white truncate max-w-xs mx-auto">
                          {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-[#bfc7d4]/60">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready for extraction
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <p className="text-sm font-bold text-white">
                          Drag & drop your file here, or{" "}
                          <span className="text-[#a0caff] hover:underline">browse</span>
                        </p>
                        <p className="text-[10px] text-[#bfc7d4]/60">
                          Supports PDF, DOCX up to 10MB
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Validation Error Alert */}
                  {uploadError && (
                    <div className="bg-[#93000a]/20 border border-[#ffb4ab]/30 text-[#ffb4ab] p-3 rounded-lg text-xs font-['Inter'] flex items-center gap-2 animate-shake">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Proceed to extraction button */}
                  {selectedFile && (
                    <button
                      onClick={startMockParsing}
                      className="w-full bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-[0.98] py-3 rounded-lg font-['Geist'] text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">analytics</span>
                      <span>Extract Resume Data</span>
                    </button>
                  )}
                </div>
              ) : (
                /* Progress and Console Log States */
                <div className="bg-[#1d2022]/70 border border-[#ffffff14] rounded-2xl p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold font-['Geist']">
                      <span className="text-white">Processing Document</span>
                      <span className="text-[#a0caff]">{uploadProgress}%</span>
                    </div>
                    {/* Bar */}
                    <div className="bg-[#111415] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2294f4] h-full rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Terminal log panel */}
                  <div className="bg-[#0b0c0d] rounded-lg p-4 font-mono text-[11px] leading-relaxed text-[#a0caff]/80 space-y-2 min-h-[120px] max-h-[160px] overflow-y-auto select-none border border-[#ffffff05]">
                    {parsingLogs.map((log, index) => (
                      <div key={index} className="animate-fade-in flex items-center gap-2">
                        <span className="text-[#a0caff]/40">&gt;</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
}
