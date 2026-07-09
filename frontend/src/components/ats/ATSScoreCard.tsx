"use client";

interface ATSScoreCardProps {
  overallScore: number;
  matchScore: number;
  missingCount: number;
  strengthsCount: number;
}

export default function ATSScoreCard({
  overallScore,
  matchScore,
  missingCount,
  strengthsCount,
}: ATSScoreCardProps) {
  const getOverallDetails = (val: number) => {
    if (val >= 80) return { label: "Excellent Match", color: "#10b981", textColor: "text-[#10b981]", bgColor: "bg-[#10b981]/10", desc: "Your resume matches the job requirements perfectly." };
    if (val >= 60) return { label: "Needs Improvement", color: "#ffb781", textColor: "text-[#ffb781]", bgColor: "bg-[#ffb781]/10", desc: "Your resume needs minor improvements to match job requirements." };
    return { label: "Needs Attention", color: "#ef4444", textColor: "text-[#ef4444]", bgColor: "bg-[#ef4444]/10", desc: "Key terms and metrics are missing from your profile." };
  };

  const getMatchDetails = (val: number) => {
    if (val >= 80) return { label: "Strong Match", color: "#10b981", textColor: "text-[#10b981]", bgColor: "bg-[#10b981]/10", desc: "Great match with the job description overall." };
    if (val >= 50) return { label: "Good Match", color: "#2294f4", textColor: "text-[#2294f4]", bgColor: "bg-[#2294f4]/10", desc: "Good base matching, consider adding role keywords." };
    return { label: "Weak Match", color: "#ef4444", textColor: "text-[#ef4444]", bgColor: "bg-[#ef4444]/10", desc: "Low keyword alignment with target requirements." };
  };

  const getMissingDetails = (count: number) => {
    if (count <= 5) return { label: "Good Range", color: "#10b981", textColor: "text-[#10b981]", bgColor: "bg-[#10b981]/10", desc: "Very few critical keywords are missing." };
    if (count <= 12) return { label: "Needs Attention", color: "#ffb781", textColor: "text-[#ffb781]", bgColor: "bg-[#ffb781]/10", desc: "Important keywords missing from your resume." };
    return { label: "Critical Gaps", color: "#ef4444", textColor: "text-[#ef4444]", bgColor: "bg-[#ef4444]/10", desc: "Numerous missing keywords. Resume needs work." };
  };

  const getStrengthsDetails = (count: number) => {
    if (count >= 10) return { label: "Good Job!", color: "#10b981", textColor: "text-[#10b981]", bgColor: "bg-[#10b981]/10", desc: "Great! You have relevant skills and experience." };
    if (count >= 5) return { label: "Moderate Strengths", color: "#2294f4", textColor: "text-[#2294f4]", bgColor: "bg-[#2294f4]/10", desc: "Some strengths detected, try adding metrics." };
    return { label: "Few Strengths", color: "#ffb781", textColor: "text-[#ffb781]", bgColor: "bg-[#ffb781]/10", desc: "Add achievements and active verbs to show impact." };
  };

  const overall = getOverallDetails(overallScore);
  const match = getMatchDetails(matchScore);
  const missing = getMissingDetails(missingCount);
  const strengths = getStrengthsDetails(strengthsCount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Overall ATS Score */}
      <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-5 hover:border-[#404752] transition-colors relative overflow-hidden flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold flex items-center gap-1.5">
              Overall ATS Score
              <span className="material-symbols-outlined text-[12px] opacity-40 cursor-help" title="Weighted score across keywords, formatting, skills, experience, and education.">help</span>
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="font-['Geist'] text-3xl font-extrabold text-white">
                {overallScore}%
              </h3>
              <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${overall.textColor} ${overall.bgColor}`}>
                {overall.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[#bfc7d4] opacity-75 font-['Inter'] mt-4 leading-relaxed">
          {overall.desc}
        </p>
      </div>

      {/* Card 2: Match Score */}
      <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-5 hover:border-[#404752] transition-colors relative overflow-hidden flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold flex items-center gap-1.5">
              Match Score
              <span className="material-symbols-outlined text-[12px] opacity-40 cursor-help" title="Keyword alignment and density matching the target requirements.">help</span>
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="font-['Geist'] text-3xl font-extrabold text-white">
                {matchScore}%
              </h3>
              <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${match.textColor} ${match.bgColor}`}>
                {match.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[#bfc7d4] opacity-75 font-['Inter'] mt-4 leading-relaxed">
          {match.desc}
        </p>
      </div>

      {/* Card 3: Missing Keywords */}
      <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-5 hover:border-[#404752] transition-colors relative overflow-hidden flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold flex items-center gap-1.5">
              Missing Keywords
              <span className="material-symbols-outlined text-[12px] opacity-40 cursor-help" title="Critical industry terms or requirements absent from your resume.">help</span>
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="font-['Geist'] text-3xl font-extrabold text-white">
                {missingCount}
              </h3>
              <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${missing.textColor} ${missing.bgColor}`}>
                {missing.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[#bfc7d4] opacity-75 font-['Inter'] mt-4 leading-relaxed">
          {missing.desc}
        </p>
      </div>

      {/* Card 4: Strengths Found */}
      <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-5 hover:border-[#404752] transition-colors relative overflow-hidden flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="font-['Geist'] text-[10px] text-[#bfc7d4]/60 uppercase tracking-widest font-bold flex items-center gap-1.5">
              Strengths Found
              <span className="material-symbols-outlined text-[12px] opacity-40 cursor-help" title="Optimized layout rules, active verb count, and metrics checks successfully met.">help</span>
            </span>
            <div className="flex items-baseline gap-2">
              <h3 className="font-['Geist'] text-3xl font-extrabold text-white">
                {strengthsCount}
              </h3>
              <span className={`text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${strengths.textColor} ${strengths.bgColor}`}>
                {strengths.label}
              </span>
            </div>
          </div>
        </div>
        <p className="text-[11px] text-[#bfc7d4] opacity-75 font-['Inter'] mt-4 leading-relaxed">
          {strengths.desc}
        </p>
      </div>
    </div>
  );
}
