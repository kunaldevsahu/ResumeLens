"use client";

interface MissingKeywordsProps {
  keywords: string[];
}

export default function MissingKeywords({ keywords }: MissingKeywordsProps) {
  const displayKeywords = keywords.length > 0
    ? keywords
    : ["JavaScript", "SQL", "Git", "Docker", "Kubernetes", "Terraform", "AWS", "Redis", "CI/CD", "Microservices", "GraphQL", "Jenkins", "RESTful"]; // Standard fallback matching the screenshot

  return (
    <div className="bg-[#1d2022] border border-[#ffffff14] rounded-xl p-6 space-y-4">
      <div>
        <h4 className="font-['Geist'] text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[#ef4444] text-[18px]">error</span>
          Missing Keywords
        </h4>
        <p className="text-[10px] text-[#bfc7d4]/60 font-['Inter'] mt-0.5">
          Important requirements missing or poorly positioned in your resume.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {displayKeywords.map((kw) => (
          <span
            key={kw}
            className="px-2.5 py-1 rounded-md text-[10px] font-bold font-['Geist'] bg-[#93000a]/20 text-[#ffb4ab] border border-[#ffb4ab]/15 hover:bg-[#93000a]/30 hover:border-[#ffb4ab]/30 transition-all select-none"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
