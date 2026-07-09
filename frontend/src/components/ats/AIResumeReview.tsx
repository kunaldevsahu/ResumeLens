"use client";

import { useState } from "react";
import type { AtsReport } from "@/services/ats.service";

interface AIResumeReviewProps {
  report: AtsReport | null;
}

export default function AIResumeReview({ report }: AIResumeReviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!report || !report.aiReview) {
    return null;
  }

  const {
    overallAssessment,
    strengths,
    areasForImprovement,
    recruiterPerspective,
    interviewReadiness,
  } = report.aiReview;

  return (
    <div className="bg-[#191c1e] border border-[#ffffff14] rounded-2xl overflow-hidden transition-all duration-300 shadow-xl">
      {/* Header (Clickable for expand/collapse) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className="text-lg font-bold text-white font-['Geist'] tracking-tight flex items-center gap-2">
              AI Resume Review
            </h3>
            <p className="text-xs text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
              Personalized feedback generated using AI based on your resume and the selected job description.
            </p>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#bfc7d4] transition-transform duration-300" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
          keyboard_arrow_down
        </span>
      </button>

      {/* Content Area */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-[#ffffff0a] divide-y divide-[#ffffff0a] space-y-6 font-['Inter']">
          
          {/* Overall Assessment */}
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-['Geist']">
              <span>⭐</span> Overall Assessment
            </h4>
            <div className="bg-[#111415] border border-[#ffffff08] rounded-xl p-4 text-xs text-[#bfc7d4] leading-relaxed">
              {overallAssessment}
            </div>
          </div>

          {/* Strengths */}
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-['Geist']">
              <span>💪</span> Strengths
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-green-500/5 border border-green-500/10 rounded-xl p-3 text-xs text-[#bfc7d4]">
                  <span className="material-symbols-outlined text-green-400 text-[18px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-['Geist']">
              <span>⚠️</span> Areas for Improvement
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {areasForImprovement.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 text-xs text-[#bfc7d4]">
                  <span className="material-symbols-outlined text-amber-400 text-[18px] shrink-0 mt-0.5">
                    warning
                  </span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recruiter Perspective */}
          <div className="pt-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-['Geist']">
              <span>👔</span> Recruiter Perspective
            </h4>
            <div className="bg-[#111415] border border-[#ffffff08] rounded-xl p-4 text-xs text-[#bfc7d4] leading-relaxed italic">
              "{recruiterPerspective}"
            </div>
          </div>

          {/* Interview Readiness */}
          <div className="pt-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider font-['Geist']">
              <span>🚀</span> Interview Readiness
            </h4>
            
            <div className="flex flex-col md:flex-row items-center gap-6 bg-[#111415] border border-[#ffffff08] rounded-xl p-5">
              {/* Score Gauge */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#ffffff0c]"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-[#2294f4] transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - interviewReadiness.score / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white font-['Geist'] leading-none">
                    {interviewReadiness.score}%
                  </span>
                  <span className="text-[9px] text-[#bfc7d4]/40 font-bold uppercase tracking-wider mt-1">
                    Ready
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="text-left space-y-1">
                <h5 className="text-sm font-bold text-white font-['Geist']">
                  Match Likelihood Analysis
                </h5>
                <p className="text-xs text-[#bfc7d4]/80 leading-relaxed">
                  {interviewReadiness.explanation}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
