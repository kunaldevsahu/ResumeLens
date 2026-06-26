"use client";

interface StrengthsProps {
  strengths: string[];
}

export default function Strengths({ strengths }: StrengthsProps) {
  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-2xl p-6 space-y-4">
      <div>
        <h3 className="font-['Geist'] text-lg font-bold text-white mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#10b981]">sentiment_satisfied</span>
          Resume Strengths
        </h3>
        <p className="text-xs text-[#bfc7d4] opacity-75">
          These elements of your profile comply perfectly with standard ATS parsers.
        </p>
      </div>

      <ul className="space-y-3">
        {strengths.map((str, index) => (
          <li
            key={index}
            className="flex items-start gap-2.5 text-xs text-[#e1e2e4] font-medium font-['Inter'] leading-relaxed"
          >
            <span className="material-symbols-outlined text-[#10b981] text-[18px] shrink-0 mt-0.5 font-bold">
              check
            </span>
            <span>{str}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
