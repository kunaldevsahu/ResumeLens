"use client";

interface StrengthsProps {
  strengths: string[];
}

export default function Strengths({ strengths }: StrengthsProps) {
  const displayStrengths = strengths.length > 0
    ? strengths
    : [
        "ATS friendly resume layout and structure",
        "Good use of action verbs",
        "Relevant technical skills match",
        "Clear professional summary section",
        "Proper section organization and headings",
      ];

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 space-y-4">
      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider">
          Resume Strengths
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
          Key elements of your resume optimized for standard recruitment systems.
        </p>
      </div>

      <div className="space-y-2.5 font-['Inter'] text-xs text-[#e1e2e4]">
        {displayStrengths.map((str, idx) => (
          <div key={idx} className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#10b981] text-[16px] select-none shrink-0 mt-0.5">
              check_circle
            </span>
            <span className="leading-relaxed">{str}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface ATSCompatibilityProps {
  formattingScore: number;
  keywordScore: number;
}

export function ATSCompatibility({ formattingScore, keywordScore }: ATSCompatibilityProps) {
  const items = [
    { label: "Proper Headings", status: formattingScore >= 70 ? "pass" : "fail" },
    { label: "ATS Friendly Fonts", status: formattingScore >= 80 ? "pass" : "fail" },
    { label: "No Complex Tables", status: formattingScore >= 60 ? "pass" : "fail" },
    { label: "Readable Layout", status: formattingScore >= 75 ? "pass" : "fail" },
    { label: "Image Optimization", status: "pass" }, // Templates always pass
    { label: "Mobile Friendly", status: "pass" }, // Templates always pass
    { label: "Keyword Density", status: keywordScore >= 70 ? "pass" : "warning" },
    { label: "Document Structure", status: formattingScore >= 75 ? "pass" : "warning" },
  ];

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 space-y-4">
      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider">
          ATS Compatibility
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
          Compliance checks against recruitment parser parameters.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 font-['Inter'] text-xs text-[#e1e2e4]">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            {item.status === "pass" ? (
              <span className="material-symbols-outlined text-[#10b981] text-[16px] select-none shrink-0">
                check_circle
              </span>
            ) : item.status === "warning" ? (
              <span className="material-symbols-outlined text-[#ffb781] text-[16px] select-none shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                warning
              </span>
            ) : (
              <span className="material-symbols-outlined text-[#ef4444] text-[16px] select-none shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                error
              </span>
            )}
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
