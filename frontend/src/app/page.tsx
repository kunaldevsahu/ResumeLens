"use client";

import { useState } from "react";
import Link from "next/link";

interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  atsCompatible: boolean;
  badgeText?: string;
}

const templates: TemplateItem[] = [
  {
    id: "modern-ats",
    name: "Modern ATS",
    category: "ATS Friendly",
    description: "Highly structured, clean sans-serif layout optimized for Applicant Tracking Systems.",
    image: "/templates/modern-ats-preview.png",
    atsCompatible: true,
  },
  {
    id: "corporate",
    name: "Corporate",
    category: "Professional",
    description: "Sleek sans-serif layout with top color accent bands and left-bordered headers.",
    image: "/templates/corporate-preview.png",
    atsCompatible: true,
  },
  {
    id: "executive",
    name: "Executive",
    category: "Professional",
    description: "Classic centered layout with elegant serif typography, perfect for executive roles.",
    image: "/templates/executive-preview.png",
    atsCompatible: true,
  },
  {
    id: "two-column",
    name: "Professional Two Column",
    category: "Professional",
    description: "Asymmetrical grid split layout featuring side-by-side content panels.",
    image: "/templates/twocolumn-preview.png",
    atsCompatible: true,
  },
  {
    id: "developer",
    name: "Developer",
    category: "Creative",
    description: "Monospace font with custom command-line styling designed for programmers and tech roles.",
    image: "/templates/developer-preview.png",
    atsCompatible: false,
    badgeText: "Developer Focus",
  },
  {
    id: "minimal",
    name: "Minimal",
    category: "ATS Friendly",
    description: "Spacious layout with faint divider lines, standard-case headers, and clean margins.",
    image: "/templates/minimal-preview.png",
    atsCompatible: true,
  },
  {
    id: "startup",
    name: "Startup",
    category: "Creative",
    description: "Modern punchy layout featuring tag capsules for skills and custom tech stacks.",
    image: "/templates/startup-preview.png",
    atsCompatible: true,
  },
  {
    id: "creative",
    name: "Creative",
    category: "Creative",
    description: "Artistic off-white template with Playfair headers, warm backgrounds, and terracotta accents.",
    image: "/templates/creative-preview.png",
    atsCompatible: false,
    badgeText: "Design Focus",
  },
];

export default function LandingPage() {
  // State for the interactive mock builder preview
  const [name, setName] = useState("Jane Doe");
  const [jobTitle, setJobTitle] = useState("Senior Product Designer");
  const [location, setLocation] = useState("San Francisco, CA");
  const [email, setEmail] = useState("jane.doe@designcorp.com");
  const [skillsList, setSkillsList] = useState(["Figma", "UI/UX Architecture", "React", "Design Systems"]);
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("basics");

  const [company, setCompany] = useState("Vercel Inc");
  const [role, setRole] = useState("Lead UX Architect");
  const [dates, setDates] = useState("2023 - Present");
  const [description, setDescription] = useState("Led redesign of developer console dashboard, resulting in 40% user retention growth.");

  const [school, setSchool] = useState("Stanford University");
  const [degree, setDegree] = useState("M.S. in Human-Computer Interaction");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skillsList.includes(newSkill.trim())) {
      setSkillsList([...skillsList, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter(s => s !== skillToRemove));
  };

  return (
    <div className="min-h-screen bg-[#111415] text-[#e1e2e4] overflow-x-hidden selection:bg-[#a0caff]/30 selection:text-[#a0caff] font-['Inter']">
      
      {/* 1. Header & Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-[#ffffff08] bg-[#111415]/75 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#a0caff] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-[#003259] font-bold text-lg">lens</span>
            </div>
            <span className="font-['Geist'] font-bold text-lg text-white tracking-tight">
              ResumeLens
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#bfc7d4]">
            <a href="#templates-section" className="hover:text-white transition-colors">Templates</a>
            <a href="#features-section" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-[#bfc7d4] hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm font-bold bg-[#a0caff] text-[#003259] rounded-lg shadow-md hover:bg-[#c2dcff] hover:scale-[1.02] active:scale-[0.98] transition-all">
              Create Resume
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#a0caff]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
              Modern SaaS Resume Builder
            </div>
            
            <h1 className="font-['Geist'] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Build Professional Resumes <br />
              <span className="bg-gradient-to-r from-[#a0caff] to-[#2294f4] bg-clip-text text-transparent">
                That Get You Noticed
              </span>
            </h1>

            <p className="text-[#bfc7d4] text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Create, customize, preview, and export beautiful resumes using premium templates. 
              Designed to clear ATS screenings and wow hiring managers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/register" className="px-6 py-3 bg-[#a0caff] text-[#003259] font-bold text-center rounded-lg shadow-lg shadow-[#a0caff]/10 hover:bg-[#c2dcff] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Create Resume
              </Link>
              <a href="#templates-section" className="px-6 py-3 bg-white/5 border border-white/10 text-white font-bold text-center rounded-lg hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Browse Templates
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#ffffff08] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-medium text-[#bfc7d4]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b981] text-lg font-bold">check_circle</span>
                ATS Friendly Templates
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1a91f0] text-lg font-bold">visibility</span>
                Live Preview
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffb781] text-lg font-bold">dashboard</span>
                Professional Layouts
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#10b981] text-lg font-bold">download</span>
                PDF Export
              </div>
            </div>
          </div>

          {/* Right Live Resume Mockup Column */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[380px] group">
              {/* Glowing Background Blur Accent */}
              <div className="absolute inset-0 -m-4 bg-gradient-to-r from-[#a0caff]/10 to-[#2294f4]/10 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Realistic A4 Resume Miniature */}
              <div className="relative bg-white text-slate-800 p-6 rounded-xl border border-slate-100 shadow-2xl text-[9px] font-sans aspect-[1/1.414] overflow-hidden select-none">
                <div className="text-center pb-2.5 border-b border-slate-200">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Alex Johnson</h2>
                  <p className="text-[9px] font-bold text-[#1e3a8a] uppercase tracking-wider mt-0.5">Senior Software Engineer</p>
                  <div className="flex justify-center flex-wrap gap-2 text-slate-500 text-[8px] mt-1.5 font-medium">
                    <span>alex.johnson@xyz.com</span>
                    <span>•</span>
                    <span>+1 (555) 123-4567</span>
                    <span>•</span>
                    <span>San Francisco, CA</span>
                  </div>
                </div>
                
                {/* Summary */}
                <div className="mt-3 space-y-1">
                  <h3 className="text-[9px] font-bold text-slate-900 uppercase border-b border-slate-100 pb-0.5 tracking-wide">Summary</h3>
                  <p className="text-slate-600 leading-normal text-[8px]">
                    Results-oriented engineer with 5+ years of experience building high-performance web systems. 
                    Specialized in React, Next.js, and API architecture optimization.
                  </p>
                </div>

                {/* Experience */}
                <div className="mt-3.5 space-y-1.5">
                  <h3 className="text-[9px] font-bold text-slate-900 uppercase border-b border-slate-100 pb-0.5 tracking-wide">Work Experience</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[8px] font-bold text-slate-900">
                      <span>Senior Engineer @ Vercel Inc</span>
                      <span className="text-[7.5px] text-slate-400 font-semibold">2022 - Present</span>
                    </div>
                    <ul className="list-disc pl-3 text-slate-600 leading-normal text-[7.5px] space-y-0.5">
                      <li>Led development of responsive dashboard screens using React and Tailwind CSS.</li>
                      <li>Optimized API calls to reduce dashboard page load latencies by 35%.</li>
                    </ul>
                  </div>
                </div>

                {/* Projects */}
                <div className="mt-3.5 space-y-1.5">
                  <h3 className="text-[9px] font-bold text-slate-900 uppercase border-b border-slate-100 pb-0.5 tracking-wide">Key Projects</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-[8px] font-bold text-slate-900">
                      <span>ResumeLens Builder Engine</span>
                      <span className="text-[7.5px] text-slate-400 font-semibold">React, TypeScript</span>
                    </div>
                    <p className="text-slate-600 leading-normal text-[7.5px]">
                      Created a canvas-scaled A4 layout generator rendering templates dynamically with zero lag.
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-3.5 space-y-1">
                  <h3 className="text-[9px] font-bold text-slate-900 uppercase border-b border-slate-100 pb-0.5 tracking-wide">Skills</h3>
                  <div className="text-slate-600 font-semibold text-[8px] leading-relaxed pt-0.5">
                    React • TypeScript • Tailwind CSS • Next.js • GraphQL • Node.js • PostgreSQL • Docker
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 2: Template Showcase Slider */}
      <section id="templates-section" className="py-20 border-t border-[#ffffff05] bg-gradient-to-b from-[#111415] to-[#0c0f10]">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="font-['Geist'] text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Choose From Professional Templates
            </h2>
            <p className="text-[#bfc7d4] text-sm max-w-lg mx-auto font-normal">
              Select one of our curated designs. Switch styles instantly in one click at any time without losing any data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.slice(0, 6).map((template) => (
              <div key={template.id} className="group flex flex-col bg-[#191c1e]/40 border border-[#ffffff08] rounded-xl overflow-hidden hover:border-[#a0caff]/35 hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-[4/5] bg-[#0c0f10] relative overflow-hidden border-b border-[#ffffff05]">
                  <img
                    src={template.image}
                    alt={template.name}
                    className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-[1.02]"
                  />
                  {template.atsCompatible && (
                    <span className="absolute top-4 left-4 px-2 py-0.5 bg-[#10b981]/15 text-[#10b981] text-[9px] font-bold tracking-widest uppercase rounded border border-[#10b981]/30 backdrop-blur-md">
                      ATS Friendly
                    </span>
                  )}
                  {template.badgeText && (
                    <span className="absolute top-4 left-4 px-2 py-0.5 bg-[#ffb781]/15 text-[#ffb781] text-[9px] font-bold tracking-widest uppercase rounded border border-[#ffb781]/30 backdrop-blur-md">
                      {template.badgeText}
                    </span>
                  )}
                </div>
                <div className="p-5 text-left bg-[#111415]/20 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-['Geist'] text-base font-bold text-white group-hover:text-[#a0caff] transition-colors">{template.name}</h3>
                    <p className="text-xs text-[#bfc7d4]/70 mt-1 leading-relaxed">{template.description}</p>
                  </div>
                  <Link href="/register" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#a0caff] group-hover:text-white transition-colors pt-2">
                    Use Template <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section 3: Interactive Live Builder Playground */}
      <section id="interactive-builder" className="py-24 border-t border-[#ffffff05] bg-[#0c0f10]">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-['Geist'] text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Live Builder Preview
            </h2>
            <p className="text-[#bfc7d4] text-sm max-w-xl mx-auto">
              See changes instantly while building your resume. No page refreshes. No guesswork. Type in the mock form below to try it.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Mock Form Builder */}
            <div className="lg:col-span-5 bg-[#191c1e]/70 border border-[#ffffff0a] rounded-xl overflow-hidden shadow-xl flex flex-col h-[520px]">
              {/* Form Tabs */}
              <div className="flex border-b border-[#ffffff0a] bg-[#111415]/50 text-xs font-semibold text-[#bfc7d4] overflow-x-auto">
                <button
                  onClick={() => setActiveTab("basics")}
                  className={`px-4 py-3 flex items-center gap-1 shrink-0 border-b-2 transition-all ${
                    activeTab === "basics" ? "border-[#a0caff] text-white bg-white/5" : "border-transparent hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">person</span> Basics
                </button>
                <button
                  onClick={() => setActiveTab("experience")}
                  className={`px-4 py-3 flex items-center gap-1 shrink-0 border-b-2 transition-all ${
                    activeTab === "experience" ? "border-[#a0caff] text-white bg-white/5" : "border-transparent hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">work</span> Experience
                </button>
                <button
                  onClick={() => setActiveTab("skills")}
                  className={`px-4 py-3 flex items-center gap-1 shrink-0 border-b-2 transition-all ${
                    activeTab === "skills" ? "border-[#a0caff] text-white bg-white/5" : "border-transparent hover:text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">construction</span> Skills
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-left custom-scrollbar text-xs">
                {activeTab === "basics" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                        placeholder="e.g. Jane Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Job Title</label>
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                        placeholder="e.g. Senior Designer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold">Location</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "experience" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold">Company</label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-slate-400 font-bold">Role</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Dates</label>
                      <input
                        type="text"
                        value={dates}
                        onChange={(e) => setDates(e.target.value)}
                        className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold">Description / Achievements</label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors resize-none font-sans"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "skills" && (
                  <div className="space-y-4">
                    <form onSubmit={handleAddSkill} className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#111415] border border-[#ffffff14] rounded-lg text-white focus:outline-none focus:border-[#a0caff]/50 transition-colors"
                        placeholder="Add a skill (e.g. Next.js)"
                      />
                      <button type="submit" className="px-4 bg-[#a0caff] text-[#003259] font-bold rounded-lg hover:bg-[#c2dcff]">
                        Add
                      </button>
                    </form>
                    <div className="space-y-1.5">
                      <label className="text-slate-400 font-bold">Active Stack</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {skillsList.map((skill, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-white text-[11px] font-medium">
                            {skill}
                            <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400 ml-1">
                              <span className="material-symbols-outlined text-xs">close</span>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Live Resume A4 Preview */}
            <div className="lg:col-span-7 flex justify-center w-full">
              <div className="bg-white text-slate-800 p-8 rounded-xl border border-slate-200 shadow-2xl text-[10px] font-sans aspect-[1/1.414] w-full max-w-[440px] text-left transition-all duration-300 min-h-[620px]">
                {/* Header */}
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight transition-all">{name || "Untitled Name"}</h3>
                  <p className="text-[10px] font-bold text-[#1e3a8a] uppercase tracking-wider mt-0.5">{jobTitle || "Job Title"}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-[9px] mt-2 font-medium">
                    {email && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">mail</span> {email}
                      </span>
                    )}
                    {location && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">location_on</span> {location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Experience */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-800 border-b border-slate-100 pb-0.5 uppercase tracking-wide">Experience</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline font-bold text-slate-900 text-[9.5px]">
                      <span>{role || "Lead Role"} @ {company || "Company"}</span>
                      <span className="text-[8.5px] text-slate-400 font-semibold">{dates}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[9px] whitespace-pre-wrap">{description}</p>
                  </div>
                </div>

                {/* Skills */}
                {skillsList.length > 0 && (
                  <div className="mt-4 space-y-1.5">
                    <h4 className="text-[10px] font-bold text-slate-800 border-b border-slate-100 pb-0.5 uppercase tracking-wide">Skills</h4>
                    <div className="text-slate-600 font-semibold text-[9.5px] leading-relaxed pt-0.5">
                      {skillsList.join("  •  ")}
                    </div>
                  </div>
                )}

                {/* Education */}
                <div className="mt-4 space-y-2">
                  <h4 className="text-[10px] font-bold text-slate-800 border-b border-slate-100 pb-0.5 uppercase tracking-wide">Education</h4>
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-slate-900 text-[9.5px]">{school}</h5>
                    <p className="text-slate-500 italic text-[9px]">{degree}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section 4: Why ResumeLens (Feature Cards) */}
      <section id="features-section" className="py-24 border-t border-[#ffffff05] bg-gradient-to-b from-[#0c0f10] to-[#111415]">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="font-['Geist'] text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Designed For High-Performance Applications
            </h2>
            <p className="text-[#bfc7d4] text-sm max-w-lg mx-auto">
              Everything you need to create a modern CV that stands out in the pile. Engineered for maximum compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {/* Feature 1 */}
            <div className="p-6 bg-[#191c1e]/40 border border-[#ffffff08] rounded-xl hover:border-[#a0caff]/20 transition-colors">
              <span className="material-symbols-outlined text-[#a0caff] text-3xl mb-4 bg-[#a0caff]/10 p-2.5 rounded-lg">dashboard</span>
              <h3 className="font-['Geist'] text-lg font-bold text-white mb-2">Multiple Templates</h3>
              <p className="text-[#bfc7d4] text-xs leading-relaxed font-normal">
                Switch between professional templates instantly. Whether you want a clean modern ATS structure, or an asymmetric double column startup layout, switch styles on the fly.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-[#191c1e]/40 border border-[#ffffff08] rounded-xl hover:border-[#a0caff]/20 transition-colors">
              <span className="material-symbols-outlined text-[#1a91f0] text-3xl mb-4 bg-[#1a91f0]/10 p-2.5 rounded-lg">visibility</span>
              <h3 className="font-['Geist'] text-lg font-bold text-white mb-2">Live Preview</h3>
              <p className="text-[#bfc7d4] text-xs leading-relaxed font-normal">
                See exactly what recruiters will see. The live rendering screen scales dynamically on A4 workspace preview formats. No PDF rendering guesswork.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-[#191c1e]/40 border border-[#ffffff08] rounded-xl hover:border-[#a0caff]/20 transition-colors">
              <span className="material-symbols-outlined text-[#10b981] text-3xl mb-4 bg-[#10b981]/10 p-2.5 rounded-lg">verified</span>
              <h3 className="font-['Geist'] text-lg font-bold text-white mb-2">ATS Friendly Designs</h3>
              <p className="text-[#bfc7d4] text-xs leading-relaxed font-normal">
                Clean HTML structures, outline SVG icons, list bullet parsers, and dot-separated arrays. Every design is engineered to clear modern ATS scanners.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-[#191c1e]/40 border border-[#ffffff08] rounded-xl hover:border-[#a0caff]/20 transition-colors">
              <span className="material-symbols-outlined text-[#ffb781] text-3xl mb-4 bg-[#ffb781]/10 p-2.5 rounded-lg">download</span>
              <h3 className="font-['Geist'] text-lg font-bold text-white mb-2">PDF Export</h3>
              <p className="text-[#bfc7d4] text-xs leading-relaxed font-normal">
                Download professional resumes in seconds. Standard print formatting triggers correct breaks and dimensions without cutting lines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Section 5: How It Works */}
      <section id="how-it-works" className="py-24 border-t border-[#ffffff05] bg-[#0c0f10]">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="font-['Geist'] text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              How It Works
            </h2>
            <p className="text-[#bfc7d4] text-sm max-w-lg mx-auto">
              Follow these simple steps to build and download your next resume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center pt-6 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center space-y-3 bg-[#191c1e]/20 border border-[#ffffff08] p-5 rounded-xl z-10 relative">
              <div className="w-10 h-10 rounded-full bg-[#a0caff]/15 border border-[#a0caff]/35 text-[#a0caff] font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="font-['Geist'] text-sm font-bold text-white">Create Resume</h4>
              <p className="text-[#bfc7d4]/70 text-[11px] leading-relaxed">Initialize a new resume structure on your workspace.</p>
            </div>

            {/* Connection Arrow */}
            <div className="hidden md:flex justify-center text-slate-600">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center space-y-3 bg-[#191c1e]/20 border border-[#ffffff08] p-5 rounded-xl z-10 relative">
              <div className="w-10 h-10 rounded-full bg-[#1a91f0]/15 border border-[#1a91f0]/35 text-[#1a91f0] font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="font-['Geist'] text-sm font-bold text-white">Choose Template</h4>
              <p className="text-[#bfc7d4]/70 text-[11px] leading-relaxed">Select from 8 layouts optimized for hiring departments.</p>
            </div>

            {/* Connection Arrow */}
            <div className="hidden md:flex justify-center text-slate-600">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center space-y-3 bg-[#191c1e]/20 border border-[#ffffff08] p-5 rounded-xl z-10 relative">
              <div className="w-10 h-10 rounded-full bg-[#ffb781]/15 border border-[#ffb781]/35 text-[#ffb781] font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="font-['Geist'] text-sm font-bold text-white">Customize</h4>
              <p className="text-[#bfc7d4]/70 text-[11px] leading-relaxed">Input your details, stack skills, and layout dates.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-0 md:pt-4 max-w-xl mx-auto">
            {/* Step 4 */}
            <div className="flex flex-col items-center space-y-3 bg-[#191c1e]/20 border border-[#ffffff08] p-5 rounded-xl z-10">
              <div className="w-10 h-10 rounded-full bg-[#10b981]/15 border border-[#10b981]/35 text-[#10b981] font-bold text-sm flex items-center justify-center">
                4
              </div>
              <h4 className="font-['Geist'] text-sm font-bold text-white">Preview</h4>
              <p className="text-[#bfc7d4]/70 text-[11px] leading-relaxed">Double check spelling and alignments live in A4.</p>
            </div>

            {/* Connection Arrow */}
            <div className="hidden md:flex justify-center text-slate-600">
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col items-center space-y-3 bg-[#191c1e]/20 border border-[#ffffff08] p-5 rounded-xl z-10">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-400 font-bold text-sm flex items-center justify-center">
                5
              </div>
              <h4 className="font-['Geist'] text-sm font-bold text-white">Download PDF</h4>
              <p className="text-[#bfc7d4]/70 text-[11px] leading-relaxed">Get a clean document ready for recruitment teams.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section 7: Final CTA Section */}
      <section className="py-24 border-t border-[#ffffff05] bg-gradient-to-b from-[#111415] to-[#0c0f10] relative">
        {/* Glow Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#a0caff]/5 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
          <h2 className="font-['Geist'] text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready To Build Your Next Resume?
          </h2>
          <p className="text-[#bfc7d4] text-base max-w-lg mx-auto font-normal leading-relaxed">
            Create professional resumes using premium templates. Switch designs instantly and download PDFs with no hidden fees or watermarks.
          </p>
          <div className="pt-2">
            <Link href="/register" className="px-8 py-4 bg-[#a0caff] text-[#003259] font-bold text-base rounded-lg shadow-xl shadow-[#a0caff]/10 hover:bg-[#c2dcff] hover:scale-[1.02] active:scale-[0.98] transition-all">
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#ffffff05] bg-[#0c0f10] text-[#bfc7d4] text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#a0caff] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#003259] font-bold text-sm">lens</span>
            </div>
            <span className="font-['Geist'] font-bold text-white text-sm">
              ResumeLens
            </span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} ResumeLens. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
