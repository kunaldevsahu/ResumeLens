"use client";

import { useState } from "react";
import Link from "next/link";
import TemplateEngine from "./TemplateEngine";
import TemplateSwitcher from "./TemplateSwitcher";

export interface ResumeBuilderState {
  title: string;
  summary: string;
  skills: string;
  template: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    location: string;
    website: string;
    linkedin?: string;
    github?: string;
    codeforces?: string;
    leetcode?: string;
  };
  experience: Array<{
    id: string;
    role: string;
    company: string;
    dates: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    dates: string;
    gpa: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    tech: string;
    description: string;
    githubUrl?: string;
    demoUrl?: string;
    dates?: string;
    link?: string; // Kept for backwards compatibility
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    dates: string;
    link?: string;
  }>;
  settings?: {
    fontSize?: "sm" | "md" | "lg";
    spacing?: "compact" | "normal" | "spacious";
    sectionOrder?: string[];
  };
}

export const defaultResumeBuilderState: ResumeBuilderState = {
  title: "Untitled Resume",
  summary: "",
  skills: "",
  template: "modern-ats",
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    codeforces: "",
    leetcode: "",
  },
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  settings: {
    fontSize: "md",
    spacing: "normal",
    sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills"],
  },
};

export function resumeStateToPayload(state: ResumeBuilderState) {
  return {
    title: state.title,
    summary: state.summary,
    skills: state.skills,
    template: state.template,
    experience: {
      personalInfo: state.personalInfo,
      items: state.experience,
      settings: state.settings || {
        fontSize: "md",
        spacing: "normal",
        sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills"],
      },
    },
    education: {
      items: state.education,
      certifications: state.certifications || [],
    },
    projects: {
      items: state.projects,
    },
  };
}

export function resumeToBuilderState(resume: any): ResumeBuilderState {
  let personalInfo = {
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    codeforces: "",
    leetcode: "",
  };
  let experienceItems = [];
  let settings = {
    fontSize: "md" as const,
    spacing: "normal" as const,
    sectionOrder: ["summary", "education", "experience", "projects", "certifications", "skills"],
  };

  if (resume.experience) {
    const exp = typeof resume.experience === "string" ? JSON.parse(resume.experience) : resume.experience;
    if (exp.personalInfo) personalInfo = { ...personalInfo, ...exp.personalInfo };
    if (exp.items) experienceItems = exp.items;
    if (exp.settings) {
      settings = { ...settings, ...exp.settings };
      // Ensure "certifications" is in sectionOrder for backwards compatibility
      if (settings.sectionOrder && !settings.sectionOrder.includes("certifications")) {
        const eduIdx = settings.sectionOrder.indexOf("education");
        if (eduIdx !== -1) {
          settings.sectionOrder.splice(eduIdx + 1, 0, "certifications");
        } else {
          settings.sectionOrder.push("certifications");
        }
      }
    }
  }

  let educationItems = [];
  let certificationItems = [];
  if (resume.education) {
    const edu = typeof resume.education === "string" ? JSON.parse(resume.education) : resume.education;
    if (edu.items) educationItems = edu.items;
    if (edu.certifications) certificationItems = edu.certifications;
  }

  let projectItems = [];
  if (resume.projects) {
    const proj = typeof resume.projects === "string" ? JSON.parse(resume.projects) : resume.projects;
    if (proj.items) {
      projectItems = proj.items.map((p: any) => ({
        ...p,
        githubUrl: p.githubUrl || (p.link ? p.link : ""),
        demoUrl: p.demoUrl || "",
        dates: p.dates || "",
      }));
    }
  }

  return {
    title: resume.title || "Untitled Resume",
    summary: resume.summary || "",
    skills: resume.skills || "",
    template: resume.template || "modern-ats",
    personalInfo,
    experience: experienceItems,
    education: educationItems,
    projects: projectItems,
    certifications: certificationItems,
    settings,
  };
}

interface ResumeBuilderWorkspaceProps {
  mode: "create" | "edit";
  value: ResumeBuilderState;
  saveStatus: "Unsaved" | "Saved" | "Saving..." | "Error Saving";
  primaryActionLabel: string;
  onChange: (nextState: ResumeBuilderState) => void;
  onSave: () => void;
}

type TabType = "basics" | "experience" | "education" | "projects" | "certifications";

export default function ResumeBuilderWorkspace({
  mode,
  value,
  saveStatus,
  primaryActionLabel,
  onChange,
  onSave,
}: ResumeBuilderWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basics");
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [zoom, setZoom] = useState(0.8);

  // Form field helpers
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, title: e.target.value });
  };

  const handleBasicsChange = (field: string, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const handlePersonalInfoChange = (field: string, val: string) => {
    onChange({
      ...value,
      personalInfo: {
        ...value.personalInfo,
        [field]: val,
      },
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      role: "",
      company: "",
      dates: "",
      description: "",
    };
    onChange({
      ...value,
      experience: [...value.experience, newItem],
    });
  };

  const updateExperience = (id: string, field: string, val: string) => {
    onChange({
      ...value,
      experience: value.experience.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    });
  };

  const deleteExperience = (id: string) => {
    onChange({
      ...value,
      experience: value.experience.filter((item) => item.id !== id),
    });
  };

  // Education handlers
  const addEducation = () => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      degree: "",
      school: "",
      dates: "",
      gpa: "",
    };
    onChange({
      ...value,
      education: [...value.education, newItem],
    });
  };

  const updateEducation = (id: string, field: string, val: string) => {
    onChange({
      ...value,
      education: value.education.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    });
  };

  const deleteEducation = (id: string) => {
    onChange({
      ...value,
      education: value.education.filter((item) => item.id !== id),
    });
  };

  // Project handlers
  const addProject = () => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      tech: "",
      description: "",
      githubUrl: "",
      demoUrl: "",
      dates: "",
    };
    onChange({
      ...value,
      projects: [...value.projects, newItem],
    });
  };

  const updateProject = (id: string, field: string, val: string) => {
    onChange({
      ...value,
      projects: value.projects.map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    });
  };

  const deleteProject = (id: string) => {
    onChange({
      ...value,
      projects: value.projects.filter((item) => item.id !== id),
    });
  };

  // Certification handlers
  const addCertification = () => {
    const newItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: "",
      issuer: "",
      dates: "",
      link: "",
    };
    onChange({
      ...value,
      certifications: [...(value.certifications || []), newItem],
    });
  };

  const updateCertification = (id: string, field: string, val: string) => {
    onChange({
      ...value,
      certifications: (value.certifications || []).map((item) =>
        item.id === id ? { ...item, [field]: val } : item
      ),
    });
  };

  const deleteCertification = (id: string) => {
    onChange({
      ...value,
      certifications: (value.certifications || []).filter((item) => item.id !== id),
    });
  };

  // Template switch handler
  const handleSelectTemplate = (templateId: string) => {
    onChange({ ...value, template: templateId });
  };

  const handleSettingChange = (field: string, val: any) => {
    onChange({
      ...value,
      settings: {
        ...value.settings,
        [field]: val,
      },
    });
  };

  const moveSection = (idx: number, direction: "up" | "down") => {
    const order = [...(value.settings?.sectionOrder || ["summary", "experience", "projects", "skills", "education"])];
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    
    const temp = order[idx];
    order[idx] = order[targetIdx];
    order[targetIdx] = temp;
    
    handleSettingChange("sectionOrder", order);
  };

  return (
    <div className="min-h-screen bg-[#0c0f10] text-[#e1e2e4] flex flex-col font-['Geist'] h-screen overflow-hidden">
      {/* Top Workspace Navbar */}
      <header className="h-16 border-b border-[#ffffff14] bg-[#111415] px-6 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/resumes"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#191c1e] hover:bg-[#1d2022] text-[#bfc7d4] hover:text-white text-xs font-bold rounded-lg border border-[#ffffff14] transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back
          </Link>
          <div className="h-4 w-[1px] bg-[#ffffff14]" />
          <input
            type="text"
            value={value.title}
            onChange={handleTitleChange}
            placeholder="Resume Title"
            className="bg-transparent border-none text-sm font-bold text-white focus:outline-none placeholder-white/30 w-48 sm:w-64"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Save Status Badge */}
          <div className="flex items-center gap-1.5 text-xs">
            {saveStatus === "Saving..." && (
              <>
                <span className="h-2 w-2 rounded-full bg-[#ffb781] animate-pulse" />
                <span className="text-[#ffb781]">Saving changes...</span>
              </>
            )}
            {saveStatus === "Saved" && (
              <>
                <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                <span className="text-[#bfc7d4]/85">Saved to cloud</span>
              </>
            )}
            {saveStatus === "Unsaved" && (
              <>
                <span className="h-2 w-2 rounded-full bg-[#bfc7d4]/50" />
                <span className="text-[#bfc7d4]/60">Unsaved changes</span>
              </>
            )}
            {saveStatus === "Error Saving" && (
              <>
                <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                <span className="text-[#ef4444]">Error saving</span>
              </>
            )}
          </div>

          <button
            onClick={() => setIsSwitcherOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#191c1e] hover:bg-[#1d2022] text-[#bfc7d4] hover:text-white text-xs font-bold rounded-lg border border-[#ffffff14] cursor-pointer transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm text-[#a0caff]">dashboard_customize</span>
            Change Template
          </button>

          <button
            onClick={onSave}
            className="bg-[#2294f4] text-[#002b4e] py-1.5 px-4 rounded-lg font-bold text-xs hover:opacity-90 active:scale-[0.98] transition-all"
          >
            {primaryActionLabel}
          </button>
        </div>
      </header>

      {/* Main Split Screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Editor Form Panel */}
        <div className="w-full md:w-[480px] lg:w-[540px] border-r border-[#ffffff14] bg-[#111415] flex flex-col shrink-0">
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-[#ffffff14] text-xs overflow-x-auto shrink-0 custom-scrollbar">
            <button
              onClick={() => setActiveTab("basics")}
              className={`flex-1 min-w-[75px] py-3 text-center font-bold tracking-wide border-b-2 transition-all ${
                activeTab === "basics"
                  ? "border-[#2294f4] text-[#2294f4]"
                  : "border-transparent text-[#bfc7d4] hover:text-white"
              }`}
            >
              Basics
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`flex-1 min-w-[90px] py-3 text-center font-bold tracking-wide border-b-2 transition-all ${
                activeTab === "experience"
                  ? "border-[#2294f4] text-[#2294f4]"
                  : "border-transparent text-[#bfc7d4] hover:text-white"
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setActiveTab("education")}
              className={`flex-1 min-w-[90px] py-3 text-center font-bold tracking-wide border-b-2 transition-all ${
                activeTab === "education"
                  ? "border-[#2294f4] text-[#2294f4]"
                  : "border-transparent text-[#bfc7d4] hover:text-white"
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`flex-1 min-w-[85px] py-3 text-center font-bold tracking-wide border-b-2 transition-all ${
                activeTab === "projects"
                  ? "border-[#2294f4] text-[#2294f4]"
                  : "border-transparent text-[#bfc7d4] hover:text-white"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("certifications")}
              className={`flex-1 min-w-[105px] py-3 text-center font-bold tracking-wide border-b-2 transition-all ${
                activeTab === "certifications"
                  ? "border-[#2294f4] text-[#2294f4]"
                  : "border-transparent text-[#bfc7d4] hover:text-white"
              }`}
            >
              Certifications
            </button>
          </div>

          {/* Form Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* BASICS TAB */}
            {activeTab === "basics" && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#a0caff]">Personal Info</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={value.personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                      placeholder="Alexander Sterling"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Job Title</label>
                    <input
                      type="text"
                      value={value.personalInfo.jobTitle}
                      onChange={(e) => handlePersonalInfoChange("jobTitle", e.target.value)}
                      placeholder="Senior Software Engineer"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Email</label>
                    <input
                      type="email"
                      value={value.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Phone</label>
                    <input
                      type="text"
                      value={value.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      placeholder="+1 (555) 000-1234"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={value.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange("location", e.target.value)}
                      placeholder="San Francisco, CA"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Website / Portfolio</label>
                    <input
                      type="text"
                      value={value.personalInfo.website}
                      onChange={(e) => handlePersonalInfoChange("website", e.target.value)}
                      placeholder="alexander.dev"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>
                  
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={value.personalInfo.linkedin || ""}
                      onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)}
                      placeholder="linkedin.com/in/alex"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">GitHub Profile</label>
                    <input
                      type="text"
                      value={value.personalInfo.github || ""}
                      onChange={(e) => handlePersonalInfoChange("github", e.target.value)}
                      placeholder="github.com/alex"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">LeetCode Handle</label>
                    <input
                      type="text"
                      value={value.personalInfo.leetcode || ""}
                      onChange={(e) => handlePersonalInfoChange("leetcode", e.target.value)}
                      placeholder="leetcode.com/u/alex"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Codeforces Handle</label>
                    <input
                      type="text"
                      value={value.personalInfo.codeforces || ""}
                      onChange={(e) => handlePersonalInfoChange("codeforces", e.target.value)}
                      placeholder="codeforces.com/profile/alex"
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-2.5 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                    />
                  </div>
                </div>

                <div className="h-[1px] bg-[#ffffff14] my-2" />

                <div className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Professional Summary</label>
                    <textarea
                      value={value.summary}
                      onChange={(e) => handleBasicsChange("summary", e.target.value)}
                      placeholder="Experienced engineer with a track record of..."
                      rows={5}
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-3 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors leading-relaxed resize-none"
                    />
                    <span className="text-[9px] text-[#bfc7d4]/40 mt-1 block font-sans">
                      Supports formatting: **bold**, *italic*, [link text](url).
                    </span>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Skills (Comma-separated)</label>
                    <textarea
                      value={value.skills}
                      onChange={(e) => handleBasicsChange("skills", e.target.value)}
                      placeholder="React, TypeScript, Node.js, Next.js, PostgreSQL"
                      rows={3}
                      className="w-full bg-[#191c1e] border border-[#ffffff14] rounded-lg px-4 py-3 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors leading-relaxed resize-none"
                    />
                  </div>
                </div>

                <div className="h-[1px] bg-[#ffffff14] my-2" />

                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#a0caff]">Layout & Typography</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Font Size</label>
                      <div className="flex gap-2 bg-[#191c1e] p-1 rounded-lg border border-[#ffffff14]">
                        {(["sm", "md", "lg"] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleSettingChange("fontSize", sz)}
                            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md transition-all uppercase ${
                              (value.settings?.fontSize || "md") === sz
                                ? "bg-[#2294f4] text-[#002b4e]"
                                : "text-[#bfc7d4] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {sz === "sm" ? "Small" : sz === "md" ? "Medium" : "Large"}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Page Spacing</label>
                      <div className="flex gap-2 bg-[#191c1e] p-1 rounded-lg border border-[#ffffff14]">
                        {(["compact", "normal", "spacious"] as const).map((sp) => (
                          <button
                            key={sp}
                            type="button"
                            onClick={() => handleSettingChange("spacing", sp)}
                            className={`flex-1 py-1.5 text-center text-xs font-bold rounded-md transition-all uppercase ${
                              (value.settings?.spacing || "normal") === sp
                                ? "bg-[#2294f4] text-[#002b4e]"
                                : "text-[#bfc7d4] hover:text-white hover:bg-white/5"
                            }`}
                          >
                            {sp === "compact" ? "Tight" : sp === "normal" ? "Normal" : "Wide"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#bfc7d4]/70 mb-1.5 block uppercase tracking-wider">Section Order (Reorder)</label>
                    <div className="space-y-2 bg-[#191c1e] border border-[#ffffff14] rounded-lg p-3">
                      {(value.settings?.sectionOrder || ["summary", "education", "experience", "projects", "certifications", "skills"]).map((section, idx) => {
                        const label = {
                          summary: "Profile Summary",
                          experience: "Work Experience",
                          projects: "Featured Projects",
                          skills: "Skills & Expertise",
                          education: "Education Details",
                          certifications: "Certifications",
                        }[section as "summary" | "experience" | "projects" | "skills" | "education" | "certifications"];

                        return (
                          <div key={section} className="flex items-center justify-between bg-[#111415] border border-[#ffffff0a] px-3 py-2 rounded-md">
                            <span className="text-xs font-semibold text-white">{label}</span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveSection(idx, "up")}
                                className="p-1 rounded text-[#bfc7d4] hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                title="Move Up"
                              >
                                <span className="material-symbols-outlined text-[16px] leading-none">arrow_upward</span>
                              </button>
                              <button
                                type="button"
                                disabled={idx === (value.settings?.sectionOrder?.length || 6) - 1}
                                onClick={() => moveSection(idx, "down")}
                                className="p-1 rounded text-[#bfc7d4] hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                                title="Move Down"
                              >
                                <span className="material-symbols-outlined text-[16px] leading-none">arrow_downward</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EXPERIENCE TAB */}
            {activeTab === "experience" && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#a0caff]">Work Experience</h3>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 bg-[#2294f4]/10 text-[#a0caff] text-[10px] uppercase font-bold py-1.5 px-3 rounded border border-[#2294f4]/20 hover:bg-[#2294f4]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Item
                  </button>
                </div>

                {value.experience.length === 0 ? (
                  <div className="border border-dashed border-[#ffffff14] rounded-lg p-8 text-center text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-3xl opacity-40 mb-2">work_outline</span>
                    <p className="text-xs">No experience items added. Click the button to add work history.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {value.experience.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-[#191c1e] border border-[#ffffff14] rounded-xl p-4 relative group hover:border-[#ffffff22] transition-colors"
                      >
                        <button
                          onClick={() => deleteExperience(item.id)}
                          className="absolute top-4 right-4 text-xs text-[#bfc7d4] opacity-30 hover:opacity-100 hover:text-red-400 transition-all"
                          title="Delete Item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                        <span className="text-[10px] font-bold text-[#bfc7d4]/40 uppercase tracking-widest block mb-3">
                          Position #{idx + 1}
                        </span>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Role / Title</label>
                            <input
                              type="text"
                              value={item.role}
                              onChange={(e) => updateExperience(item.id, "role", e.target.value)}
                              placeholder="Software Engineer"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Company</label>
                            <input
                              type="text"
                              value={item.company}
                              onChange={(e) => updateExperience(item.id, "company", e.target.value)}
                              placeholder="Acme Corp"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Dates (e.g. June 2021 - Present)</label>
                            <input
                              type="text"
                              value={item.dates}
                              onChange={(e) => updateExperience(item.id, "dates", e.target.value)}
                              placeholder="June 2021 - Present"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Description</label>
                            <textarea
                              value={item.description}
                              onChange={(e) => updateExperience(item.id, "description", e.target.value)}
                              placeholder="• Spearheaded the development of a cloud platform...&#10;• Collaborated with 5 engineers..."
                              rows={4}
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors resize-none leading-relaxed"
                            />
                            <span className="text-[9px] text-[#bfc7d4]/40 mt-1 block font-sans">
                              Supports formatting: **bold**, *italic*, [link text](url). Start lines with `-` or `•` for bullets.
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* EDUCATION TAB */}
            {activeTab === "education" && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#a0caff]">Education</h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 bg-[#2294f4]/10 text-[#a0caff] text-[10px] uppercase font-bold py-1.5 px-3 rounded border border-[#2294f4]/20 hover:bg-[#2294f4]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Item
                  </button>
                </div>

                {value.education.length === 0 ? (
                  <div className="border border-dashed border-[#ffffff14] rounded-lg p-8 text-center text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-3xl opacity-40 mb-2">school</span>
                    <p className="text-xs">No education items added. Click the button to add education.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {value.education.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-[#191c1e] border border-[#ffffff14] rounded-xl p-4 relative group hover:border-[#ffffff22] transition-colors"
                      >
                        <button
                          onClick={() => deleteEducation(item.id)}
                          className="absolute top-4 right-4 text-xs text-[#bfc7d4] opacity-30 hover:opacity-100 hover:text-red-400 transition-all"
                          title="Delete Item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                        <span className="text-[10px] font-bold text-[#bfc7d4]/40 uppercase tracking-widest block mb-3">
                          Education #{idx + 1}
                        </span>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Degree / Major</label>
                            <input
                              type="text"
                              value={item.degree}
                              onChange={(e) => updateEducation(item.id, "degree", e.target.value)}
                              placeholder="B.S. in Computer Science"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">School / University</label>
                            <input
                              type="text"
                              value={item.school}
                              onChange={(e) => updateEducation(item.id, "school", e.target.value)}
                              placeholder="University of California, Berkeley"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Dates</label>
                            <input
                              type="text"
                              value={item.dates}
                              onChange={(e) => updateEducation(item.id, "dates", e.target.value)}
                              placeholder="2017 - 2021"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">GPA</label>
                            <input
                              type="text"
                              value={item.gpa}
                              onChange={(e) => updateEducation(item.id, "gpa", e.target.value)}
                              placeholder="3.8 / 4.0"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#a0caff]">Projects</h3>
                  <button
                    onClick={addProject}
                    className="flex items-center gap-1 bg-[#2294f4]/10 text-[#a0caff] text-[10px] uppercase font-bold py-1.5 px-3 rounded border border-[#2294f4]/20 hover:bg-[#2294f4]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Item
                  </button>
                </div>

                {value.projects.length === 0 ? (
                  <div className="border border-dashed border-[#ffffff14] rounded-lg p-8 text-center text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-3xl opacity-40 mb-2">code</span>
                    <p className="text-xs">No projects added. Click the button to add portfolio items.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {value.projects.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-[#191c1e] border border-[#ffffff14] rounded-xl p-4 relative group hover:border-[#ffffff22] transition-colors"
                      >
                        <button
                          onClick={() => deleteProject(item.id)}
                          className="absolute top-4 right-4 text-xs text-[#bfc7d4] opacity-30 hover:opacity-100 hover:text-red-400 transition-all"
                          title="Delete Item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                        <span className="text-[10px] font-bold text-[#bfc7d4]/40 uppercase tracking-widest block mb-3">
                          Project #{idx + 1}
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Project Name</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateProject(item.id, "name", e.target.value)}
                              placeholder="E-Commerce API"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Dates (e.g. April 2026)</label>
                            <input
                              type="text"
                              value={item.dates || ""}
                              onChange={(e) => updateProject(item.id, "dates", e.target.value)}
                              placeholder="April 2026"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Tech Stack (comma-separated)</label>
                            <input
                              type="text"
                              value={item.tech}
                              onChange={(e) => updateProject(item.id, "tech", e.target.value)}
                              placeholder="Go, Docker, PostgreSQL"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">GitHub URL</label>
                            <input
                              type="text"
                              value={item.githubUrl || ""}
                              onChange={(e) => updateProject(item.id, "githubUrl", e.target.value)}
                              placeholder="github.com/alex/project"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2 sm:col-span-1">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Live Demo URL</label>
                            <input
                              type="text"
                              value={item.demoUrl || ""}
                              onChange={(e) => updateProject(item.id, "demoUrl", e.target.value)}
                              placeholder="project.demo.com"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                           <div className="col-span-2">
                             <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Description</label>
                             <textarea
                               value={item.description}
                               onChange={(e) => updateProject(item.id, "description", e.target.value)}
                               placeholder="Developed a high-throughput REST API supporting 10k requests per second..."
                               rows={4}
                               className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors resize-none leading-relaxed"
                             />
                             <span className="text-[9px] text-[#bfc7d4]/40 mt-1 block font-sans">
                               Supports formatting: **bold**, *italic*, [link text](url). Start lines with `-` or `•` for bullets.
                             </span>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CERTIFICATIONS TAB */}
            {activeTab === "certifications" && (
              <div className="space-y-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#a0caff]">Certifications</h3>
                  <button
                    onClick={addCertification}
                    className="flex items-center gap-1 bg-[#2294f4]/10 text-[#a0caff] text-[10px] uppercase font-bold py-1.5 px-3 rounded border border-[#2294f4]/20 hover:bg-[#2294f4]/20 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span> Add Item
                  </button>
                </div>

                {!value.certifications || value.certifications.length === 0 ? (
                  <div className="border border-dashed border-[#ffffff14] rounded-lg p-8 text-center text-[#bfc7d4]">
                    <span className="material-symbols-outlined text-3xl opacity-40 mb-2">workspace_premium</span>
                    <p className="text-xs">No certifications added. Click the button to add certification credentials.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {value.certifications.map((item, idx) => (
                      <div
                        key={item.id}
                        className="bg-[#191c1e] border border-[#ffffff14] rounded-xl p-4 relative group hover:border-[#ffffff22] transition-colors"
                      >
                        <button
                          onClick={() => deleteCertification(item.id)}
                          className="absolute top-4 right-4 text-xs text-[#bfc7d4] opacity-30 hover:opacity-100 hover:text-red-400 transition-all"
                          title="Delete Item"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>

                        <span className="text-[10px] font-bold text-[#bfc7d4]/40 uppercase tracking-widest block mb-3">
                          Certification #{idx + 1}
                        </span>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Certification Name</label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateCertification(item.id, "name", e.target.value)}
                              placeholder="Supervised Machine Learning"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Issuer / Authority</label>
                            <input
                              type="text"
                              value={item.issuer}
                              onChange={(e) => updateCertification(item.id, "issuer", e.target.value)}
                              placeholder="DeepLearning.AI"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Date (e.g. May 2025)</label>
                            <input
                              type="text"
                              value={item.dates}
                              onChange={(e) => updateCertification(item.id, "dates", e.target.value)}
                              placeholder="May 2025"
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>

                          <div className="col-span-2">
                            <label className="text-[10px] font-bold text-[#bfc7d4]/60 mb-1 block uppercase tracking-wider">Credential Link / URL</label>
                            <input
                              type="text"
                              value={item.link || ""}
                              onChange={(e) => updateCertification(item.id, "link", e.target.value)}
                              placeholder="coursera.org/verify/..."
                              className="w-full bg-[#111415] border border-[#ffffff14] rounded-lg px-3 py-2 text-xs text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Preview Canvas */}
        <div className="flex-1 bg-[#0c0f10] overflow-hidden flex flex-col relative">
          {/* Preview Header / Controls */}
          <div className="h-12 border-b border-[#ffffff0c] bg-[#0c0f10] px-6 flex items-center justify-between shrink-0">
            <span className="text-[11px] font-bold text-[#bfc7d4] uppercase tracking-wider">Live Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="w-6 h-6 rounded flex items-center justify-center bg-[#191c1e] text-[#bfc7d4] hover:text-white border border-[#ffffff14]"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-sm">remove</span>
              </button>
              <span className="text-[10px] font-bold w-10 text-center text-[#bfc7d4]">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(Math.min(1.2, zoom + 0.1))}
                className="w-6 h-6 rounded flex items-center justify-center bg-[#191c1e] text-[#bfc7d4] hover:text-white border border-[#ffffff14]"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-sm">add</span>
              </button>
            </div>
          </div>

          {/* Sheet container */}
          <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
            <div
              className="origin-top bg-white text-[#1a1a1a] p-[60px] shadow-2xl transition-transform duration-200"
              style={{
                width: "850px",
                minHeight: "1100px",
                transform: `scale(${zoom})`,
                marginBottom: `${(zoom - 1) * 1100}px`, // Offset bottom margin so scrollbar fits scaled element
              }}
            >
              <TemplateEngine
                template={value.template}
                personalInfo={value.personalInfo}
                summary={value.summary}
                skills={value.skills}
                experience={value.experience}
                education={value.education}
                projects={value.projects}
                certifications={value.certifications || []}
                settings={value.settings}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Template switcher modal */}
      <TemplateSwitcher
        isOpen={isSwitcherOpen}
        onClose={() => setIsSwitcherOpen(false)}
        currentTemplate={value.template}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
