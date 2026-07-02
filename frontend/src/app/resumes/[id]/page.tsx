"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getResumeById, updateResume, type Resume } from "@/services/resume.service";
import TemplateEngine from "@/components/resumes/TemplateEngine";
import TemplateSwitcher from "@/components/resumes/TemplateSwitcher";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  location: string;
  website: string;
  linkedin?: string;
  github?: string;
  leetcode?: string;
  codeforces?: string;
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  dates: string;
  description: string;
}

interface EducationItem {
  id: string;
  degree: string;
  school: string;
  dates: string;
  gpa: string;
}

interface ProjectItem {
  id: string;
  name: string;
  tech: string;
  description: string;
  githubUrl?: string;
  demoUrl?: string;
  dates?: string;
  link?: string;
}

interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  dates: string;
  link?: string;
}

interface ResumeSettings {
  fontSize?: "sm" | "md" | "lg";
  spacing?: "compact" | "normal" | "spacious";
  sectionOrder?: string[];
}

export default function ResumeDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  // Resume data fields
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState("modern-ats");

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: "Alexander Sterling",
    email: "alex.sterling@example.com",
    phone: "+1 (555) 000-1234",
    jobTitle: "Senior Software Engineer",
    location: "San Francisco, CA",
    website: "alexander.dev",
  });

  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState<ExperienceItem[]>([]);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certifications, setCertifications] = useState<CertificationItem[]>([]);
  const [settings, setSettings] = useState<ResumeSettings>({
    fontSize: "md",
    spacing: "normal",
    sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills"],
  });

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getResumeById(params.id);

        setTitle(data.title);
        if (data.summary) setSummary(data.summary);
        if (data.skills) setSkills(data.skills);
        if (data.template) setTemplate(data.template);

        if (data.experience) {
          const expData = typeof data.experience === "string" ? JSON.parse(data.experience) : data.experience;
          if (expData.personalInfo) setPersonalInfo(expData.personalInfo);
          if (expData.items) setExperience(expData.items);
          if (expData.settings) setSettings(expData.settings);
        }

        if (data.education) {
          const eduData = typeof data.education === "string" ? JSON.parse(data.education) : data.education;
          if (eduData.items) setEducation(eduData.items);
          if (eduData.certifications) {
            setCertifications(eduData.certifications);
          } else {
            setCertifications([]);
          }
        }

        if (data.projects) {
          const projData = typeof data.projects === "string" ? JSON.parse(data.projects) : data.projects;
          if (projData.items) {
            // Map legacy projects link -> githubUrl
            const mapped = projData.items.map((p: any) => ({
              ...p,
              githubUrl: p.githubUrl || p.link || "",
              demoUrl: p.demoUrl || "",
              dates: p.dates || "",
            }));
            setProjects(mapped);
          }
          if (!data.template && projData.template) setTemplate(projData.template);
        }
      } catch (currentError) {
        setError(
          currentError instanceof Error
            ? currentError.message
            : "Failed to load resume details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadResume();
    }
  }, [params.id]);

  const handleSelectTemplate = async (templateId: string) => {
    try {
      setTemplate(templateId);
      await updateResume(params.id, { template: templateId });
    } catch (err) {
      console.error("Failed to update resume template:", err);
      alert("Failed to save template selection.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111415] text-[#bfc7d4] flex items-center justify-center">
        <div className="text-center">
          <span className="animate-spin inline-block h-8 w-8 border-4 border-[#a0caff] border-t-transparent rounded-full mb-4"></span>
          <p>Loading resume details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111415] text-[#bfc7d4] flex items-center justify-center p-8">
        <div className="bg-[#1d2022] border border-[#ffffff14] p-8 rounded-xl max-w-md w-full text-center">
          <span className="material-symbols-outlined text-4xl text-[#ef4444] mb-3">error</span>
          <p className="text-red-500 mb-6">{error}</p>
          <Link href="/resumes" className="bg-[#2294f4] text-[#002b4e] px-6 py-2.5 rounded-lg font-bold">
            Back to Resumes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#111415] text-[#e1e2e4] flex flex-col font-['Geist'] print:bg-white print:text-black">
        {/* Toolbar (Hidden in print) */}
        <header className="sticky top-0 z-40 w-full h-16 bg-[#111415]/80 backdrop-blur-md border-b border-[#ffffff14] flex items-center justify-between px-6 print:hidden">
          <div className="flex items-center gap-4">
            <Link
              href="/resumes"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#191c1e] hover:bg-[#1d2022] text-[#bfc7d4] hover:text-white text-xs font-bold rounded-lg border border-[#ffffff14] transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Resumes
            </Link>
          </div>

          <div className="text-center font-bold text-sm text-white max-w-xs truncate hidden sm:block">
            Preview — {title}
          </div>

          <div className="flex items-center gap-3">
            {/* Change Template Trigger */}
            <button
              onClick={() => setIsSwitcherOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#191c1e] hover:bg-[#1d2022] text-[#bfc7d4] hover:text-white text-xs font-bold rounded-lg border border-[#ffffff14] cursor-pointer transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm text-[#a0caff]">dashboard_customize</span>
              Change Template
            </button>

            {/* Download PDF (Disabled Premium Placeholder) */}
            <button
              disabled
              className="flex items-center gap-1.5 px-4 py-2 text-xs bg-[#2294f4]/10 text-[#a0caff]/55 rounded font-bold cursor-not-allowed border border-[#2294f4]/15 transition-all opacity-80"
              title="PDF Export is a Pro feature"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download PDF (Pro)
            </button>
          </div>
        </header>

        {/* Centered A4 Sheet Canvas Area */}
        <main className="flex-1 overflow-y-auto p-12 flex flex-col items-center justify-start print:p-0 print:overflow-visible print:bg-white bg-[#0c0f10]">
          <div className="w-[850px] min-h-[1100px] bg-white text-[#1a1a1a] p-[60px] resume-shadow print:shadow-none print:w-full print:min-h-0 print:p-0">
            <TemplateEngine
              template={template}
              personalInfo={personalInfo}
              summary={summary}
              skills={skills}
              experience={experience}
              education={education}
              projects={projects}
              certifications={certifications}
              settings={settings}
            />
          </div>
        </main>

        {/* Template Selector Drawer/Modal */}
        <TemplateSwitcher
          isOpen={isSwitcherOpen}
          onClose={() => setIsSwitcherOpen(false)}
          currentTemplate={template}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </ProtectedRoute>
  );
}