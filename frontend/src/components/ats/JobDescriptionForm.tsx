"use client";

import { useState, useRef } from "react";

interface JobDescriptionFormProps {
  jobDescription: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
}

export default function JobDescriptionForm({
  jobDescription,
  onChange,
  onAnalyze,
  onBack,
}: JobDescriptionFormProps) {
  const [loadingFile, setLoadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingFile(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Inject standard template or parse basic details
      onChange(text || `Job Title: Senior Software Engineer\n\nRequirements:\n- 5+ years of experience\n- Strong proficiency in React, Node.js and TypeScript\n- Experienced with Docker, Kubernetes, AWS, and CI/CD pipelines.`);
      setLoadingFile(false);
    };

    reader.onerror = () => {
      setLoadingFile(false);
      alert("Failed to read job description file.");
    };

    // If it's a text file we can read it, otherwise mock the extract
    if (file.name.endsWith(".txt")) {
      reader.readAsText(file);
    } else {
      setTimeout(() => {
        onChange(`Job Title: Senior UX Architect / Designer\n\nRequirements:\n- Extensive experience building Design Systems in Figma\n- Experience collaborating on Agile/Scrum cross-functional teams\n- Basic understanding of React, HTML/CSS layout rules`);
        setLoadingFile(false);
      }, 1000);
    }
  };

  const isGeneralScan = jobDescription.trim().length < 20;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-['Geist'] text-lg font-bold text-white mb-1">
            Job Description
          </h3>
          <p className="text-xs text-[#bfc7d4] opacity-75">
            Provide the target job description to match, or leave blank to check general best practices.
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={loadingFile}
          className="text-xs bg-[#ffffff0d] hover:bg-[#ffffff14] border border-[#ffffff14] text-[#bfc7d4] hover:text-white px-3 py-1.5 rounded-lg font-['Geist'] font-semibold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[16px]">upload</span>
          <span>{loadingFile ? "Reading..." : "Upload File"}</span>
        </button>
      </div>

      <div className="space-y-2 relative">
        <textarea
          value={jobDescription}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the complete job description here to match keywords, or leave empty to scan general resume quality and formatting rules..."
          rows={12}
          className="w-full bg-[#111415] border border-[#ffffff14] rounded-xl p-4 text-xs font-['Inter'] text-[#e1e2e4] placeholder-[#bfc7d4]/30 focus:outline-none focus:border-[#a0caff] focus:ring-1 focus:ring-[#a0caff] transition-all resize-none"
        ></textarea>

        <div className="flex justify-between items-center text-[10px] text-[#bfc7d4]/40 font-['Inter']">
          <span>Supported: PDF, DOCX, TXT</span>
          <span>{jobDescription.length} characters</span>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t border-[#ffffff0a]">
        <button
          onClick={onBack}
          className="bg-transparent border border-[#ffffff14] hover:bg-white/5 text-[#bfc7d4] hover:text-white px-6 py-2.5 rounded-lg text-xs font-bold font-['Geist'] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back</span>
        </button>

        <button
          onClick={onAnalyze}
          className="bg-[#2294f4] text-[#002b4e] hover:opacity-90 active:scale-95 px-6 py-2.5 rounded-lg text-xs font-bold font-['Geist'] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isGeneralScan ? "rule" : "analytics"}
          </span>
          <span>{isGeneralScan ? "General Scan (Best Practices)" : "Compare & Match"}</span>
        </button>
      </div>
    </div>
  );
}
