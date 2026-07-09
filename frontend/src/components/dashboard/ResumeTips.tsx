"use client";

import { useState } from "react";

interface Tip {
  title: string;
  example?: string;
  details: string;
}

const TIPS: Tip[] = [
  {
    title: "Recruiters prefer measurable achievements.",
    example: "Increased API response performance by 35% and cut costs.",
    details: "Always try to quantify your achievements. Numbers give recruiters a concrete idea of your impact and technical effectiveness.",
  },
  {
    title: "Keep your resume to a single page.",
    example: "Focus on your top 3-4 most relevant experiences.",
    details: "Unless you have 5+ years of relevant industry experience, keeping your resume to a single page ensures quick scanning and better focus.",
  },
  {
    title: "Start experience bullets with strong action verbs.",
    example: "Use 'Led', 'Optimized', 'Architected' instead of 'Responsible for...'",
    details: "Action verbs make your accomplishments sound active and results-driven, which immediately increases recruiter interest.",
  },
  {
    title: "Tailor your resume keywords for every job application.",
    example: "Compare your resume directly with the target job posting.",
    details: "Identify core technologies and skills in the job description and make sure they are explicitly and clearly present on your resume.",
  },
];

export default function ResumeTips() {
  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTip = TIPS[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % TIPS.length);
    setIsExpanded(false);
  };

  return (
    <div className="bg-[#191c1e] border border-[#ffffff14] rounded-2xl p-5 space-y-4 font-['Inter'] relative">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <span>💡</span>
          Resume Tip
        </h4>
        
        {/* Navigation arrow */}
        <button
          onClick={handleNext}
          title="Next Tip"
          className="w-6 h-6 rounded-lg bg-white/5 border border-white/5 text-[#bfc7d4] hover:text-white hover:bg-white/10 flex items-center justify-center cursor-pointer transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>

      {/* Tip Content */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-white leading-relaxed">
          {currentTip.title}
        </p>

        {currentTip.example && (
          <div className="bg-[#111415] border border-white/5 rounded-xl p-3 text-[11px] text-[#bfc7d4]/80 italic">
            Example: "{currentTip.example}"
          </div>
        )}

        {isExpanded && (
          <p className="text-[11px] text-[#bfc7d4]/60 leading-relaxed pt-1 animate-fadeIn">
            {currentTip.details}
          </p>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#a0caff] text-[10px] font-bold font-['Geist'] hover:underline transition-all block focus:outline-none"
        >
          {isExpanded ? "Collapse Details" : "Learn More"}
        </button>
      </div>

    </div>
  );
}
